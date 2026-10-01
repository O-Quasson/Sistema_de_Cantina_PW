import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import crypto from 'crypto';
import { Sequelize, Op } from 'sequelize';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import sharp from 'sharp';
import { Server as SocketIOServer } from 'socket.io';
import { z } from 'zod';
import helmet from 'helmet';

import UserModel from './tabela/userModel.js';
import CardapioModel from './tabela/cardapioModel.js';
import IngredienteModel from './tabela/ingredienteModel.js';
import PedidoModel from './tabela/pedidoModel.js';
import PredefinicaoModel from './tabela/predefinicaoModel.js';
import RecuperacaoSenhaModel from './tabela/recuperacaoSenhaModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_URLS = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map((value) => value.trim()).filter(Boolean);
const COOKIE_NAME = 'sessao';
const COOKIE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const HORARIO_LIMITE = { hora: 10, minuto: 30 };
const PORCOES_VALIDAS = ['200g', '300g', '400g', '500g'];
const DIAS_UTEIS = new Set([1, 2, 3, 4, 5]);
const CAMPO_PREDEFINICAO_POR_DIA = { 1: 'segunda', 2: 'terca', 3: 'quarta', 4: 'quinta', 5: 'sexta' };
const uploadsDir = path.join(__dirname, 'uploads');

const databaseDialect = process.env.DB_DIALECT || 'postgres';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET é obrigatório e deve ter pelo menos 32 caracteres.');
}
if (databaseDialect !== 'sqlite' && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL é obrigatório quando DB_DIALECT não é sqlite.');
}
if (!process.env.COZINHA_EMAIL || !process.env.COZINHA_SENHA) {
  throw new Error('COZINHA_EMAIL e COZINHA_SENHA são obrigatórios para criar a conta única da Cozinha.');
}

const databaseUrl = process.env.DATABASE_URL;
const sequelize = databaseDialect === 'sqlite'
  ? new Sequelize({ dialect: 'sqlite', storage: process.env.DB_STORAGE || path.join(__dirname, 'database.sqlite'), logging: false })
  : new Sequelize(databaseUrl, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: process.env.DATABASE_SSL === 'true'
        ? { ssl: { require: true, rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' } }
        : undefined
    });

const User = UserModel(sequelize);
const Cardapio = CardapioModel(sequelize);
const Ingrediente = IngredienteModel(sequelize);
const Pedido = PedidoModel(sequelize);
const Predefinicao = PredefinicaoModel(sequelize);
const RecuperacaoSenha = RecuperacaoSenhaModel(sequelize);

User.hasMany(Pedido, { foreignKey: 'usuarioId' });
Pedido.belongsTo(User, { foreignKey: 'usuarioId' });
Cardapio.hasMany(Ingrediente, { foreignKey: 'cardapioId' });
Ingrediente.belongsTo(Cardapio, { foreignKey: 'cardapioId' });
Cardapio.hasMany(Pedido, { foreignKey: 'cardapioId' });
Pedido.belongsTo(Cardapio, { foreignKey: 'cardapioId' });
User.hasOne(Predefinicao, { foreignKey: 'usuarioId' });
Predefinicao.belongsTo(User, { foreignKey: 'usuarioId' });
User.hasMany(RecuperacaoSenha, { foreignKey: 'usuarioId' });
RecuperacaoSenha.belongsTo(User, { foreignKey: 'usuarioId' });

const app = express();
const io = new SocketIOServer({
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      callback(null, FRONTEND_URLS.includes(origin));
    },
    credentials: true
  }
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) return cb(null, true);
    cb(new Error('A imagem deve estar no formato JPG, JPEG ou PNG.'));
  }
});

const LIMITE_HASH_BCRYPT = 10;
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('senha-inexistente-apenas-para-comparacao', LIMITE_HASH_BCRYPT);

const respostaErro = (res, status, erro) => res.status(status).json({ erro });
const normalizarEmail = (email) => String(email || '').trim().toLowerCase();
// Nome que será exibido/salvo.
// Preserva maiúsculas e minúsculas; apenas remove espaços desnecessários.
const normalizarNomeIngrediente = (nome) =>
  String(nome || '').trim().replace(/\s+/g, ' ');

// Chave usada somente para verificar duplicidade.
// Não é usada como nome exibido.
const normalizarChaveIngrediente = (nome) =>
  normalizarNomeIngrediente(nome)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
const obterDataBrasilia = () => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).formatToParts(new Date()).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
  return {
    data: `${parts.year}-${parts.month}-${parts.day}`,
    hora: Number(parts.hour),
    minuto: Number(parts.minute),
    segundo: Number(parts.second)
  };
};

const validarDataISO = (data) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const [ano, mes, dia] = data.split('-').map(Number);
  const d = new Date(Date.UTC(ano, mes - 1, dia));
  return d.getUTCFullYear() === ano && d.getUTCMonth() === mes - 1 && d.getUTCDate() === dia;
};

const diaDaSemana = (data) => {
  const [ano, mes, dia] = data.split('-').map(Number);
  return new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay();
};

const ehDiaUtil = (data) => DIAS_UTEIS.has(diaDaSemana(data));

const dataAnterior = (a, b) => a < b;
const dataPosterior = (a, b) => a > b;

const prazoExpirado = (data) => {
  if (!validarDataISO(data)) return true;
  const agora = obterDataBrasilia();
  if (dataAnterior(data, agora.data)) return true;
  if (dataPosterior(data, agora.data)) return false;
  return agora.hora > HORARIO_LIMITE.hora || (agora.hora === HORARIO_LIMITE.hora && agora.minuto >= HORARIO_LIMITE.minuto);
};

const podeEditarCardapio = (data) => !prazoExpirado(data);

const schemaCadastro = z.object({
  RM: z.coerce.number().int().positive().max(999999999),
  nome: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  senha: z.string().min(8).max(128)
});

const schemaLoginAluno = z.object({
  RM: z.coerce.number().int().positive().max(999999999),
  senha: z.string().min(1).max(128)
});
const schemaLoginCozinha = z.object({
  email: z.string().trim().email().max(254),
  senha: z.string().min(1).max(128)
});
const schemaPedido = z.object({
  data: z.string(),
  vaiComer: z.boolean(),
  porcao: z.string().nullable().optional()
}).superRefine((value, ctx) => {
  if (!validarDataISO(value.data)) ctx.addIssue({ code: 'custom', path: ['data'], message: 'Data inválida.' });
  if (validarDataISO(value.data) && !ehDiaUtil(value.data)) ctx.addIssue({ code: 'custom', path: ['data'], message: 'Não há almoço disponível neste dia.' });
  if (value.vaiComer && !PORCOES_VALIDAS.includes(value.porcao || '')) ctx.addIssue({ code: 'custom', path: ['porcao'], message: 'Escolha uma porção válida.' });
  if (!value.vaiComer && value.porcao != null && value.porcao !== '') ctx.addIssue({ code: 'custom', path: ['porcao'], message: 'A porção deve ficar vazia quando não for comer.' });
});
const schemaPredefinicao = z.object({
  segunda: z.boolean(), terca: z.boolean(), quarta: z.boolean(), quinta: z.boolean(), sexta: z.boolean(),
  porcaoPadrao: z.string().refine((value) => PORCOES_VALIDAS.includes(value), 'Porção padrão inválida.')
});
const schemaPerfil = z.object({
  nome: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  senha: z.string().max(128).refine((value) => value === '' || value.length >= 8, 'A nova senha deve ter pelo menos 8 caracteres.')
});
const schemaSobra = z.object({
  sobraKg: z.coerce.number().finite().min(0).max(10000)
});

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge: COOKIE_MAX_AGE_MS,
  path: '/'
};

const definirCookieSessao = (res, usuario) => {
  const token = jwt.sign(
    { sub: String(usuario.id), tipoUsuario: usuario.tipoUsuario, versaoSessao: usuario.versaoSessao },
    process.env.JWT_SECRET,
    { expiresIn: '1d', issuer: 'sistema-cozinha-etec-bento-quirino' }
  );
  const partes = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    `Max-Age=${Math.floor(COOKIE_MAX_AGE_MS / 1000)}`,
    'Path=/','HttpOnly',
    `SameSite=${cookieOptions.sameSite === 'strict' ? 'Strict' : 'Lax'}`,
    ...(cookieOptions.secure ? ['Secure'] : [])
  ];
  res.setHeader('Set-Cookie', partes.join('; '));
};

const invalidarCookieSessao = (res) => {
  const partes = [
    `${COOKIE_NAME}=`,
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    'Path=/','HttpOnly','SameSite=Strict',
    ...(cookieOptions.secure ? ['Secure'] : [])
  ];
  res.setHeader('Set-Cookie', partes.join('; '));
};

const autenticar = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return respostaErro(res, 401, 'Sessão inválida ou expirada. Faça login novamente.');
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'sistema-cozinha-etec-bento-quirino' });
    const usuario = await User.findByPk(Number(payload.sub));
    if (!usuario || usuario.versaoSessao !== Number(payload.versaoSessao)) {
      return respostaErro(res, 401, 'Sessão inválida ou expirada. Faça login novamente.');
    }
    req.usuario = usuario;
    next();
  } catch {
    return respostaErro(res, 401, 'Sessão inválida ou expirada. Faça login novamente.');
  }
};

const exigirCozinha = (req, res, next) => {
  if (req.usuario?.tipoUsuario !== 'COZINHA') return respostaErro(res, 403, 'Apenas a cozinha pode realizar esta ação.');
  next();
};
const exigirAluno = (req, res, next) => {
  if (req.usuario?.tipoUsuario !== 'ALUNO') return respostaErro(res, 403, 'Apenas alunos podem realizar esta ação.');
  next();
};

const transporter = nodemailer.createTransport(
  process.env.SMTP_HOST
    ? {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
      }
    : { jsonTransport: true }
);

const createResetToken = () => crypto.randomBytes(32).toString('base64url');
const resetTokenTTL = 30 * 60 * 1000;

const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.' }
});
const limiterRecuperacao = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitos pedidos de recuperação seguidos. Aguarde alguns minutos e tente novamente.' }
});

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    callback(null, FRONTEND_URLS.includes(origin));
  },
  credentials: true
}));
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d', immutable: false }));

// cookie parser mínimo para não adicionar uma dependência apenas para esta leitura.
const decodificarCookie = (valor) => {
  try { return decodeURIComponent(valor); } catch { return ''; }
};

app.use((req, _res, next) => {
  req.cookies = {};
  const raw = req.headers.cookie || '';
  for (const item of raw.split(';')) {
    const index = item.indexOf('=');
    if (index === -1) continue;
    const key = decodificarCookie(item.slice(0, index).trim());
    const value = decodificarCookie(item.slice(index + 1).trim());
    if (key) req.cookies[key] = value;
  }
  next();
});

const serializarIngrediente = (ingrediente) => ({ id: ingrediente.id, nome: ingrediente.nome });
const serializarCardapio = (cardapio) => cardapio
  ? {
      id: cardapio.id,
      data: cardapio.data,
      imagemUrl: cardapio.imagemUrl,
      ingredientes: [...(cardapio.Ingredientes || [])].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')).map(serializarIngrediente),
      sobraKg: cardapio.sobraKg === null ? null : Number(cardapio.sobraKg),
      criadoEm: cardapio.createdAt,
      atualizadoEm: cardapio.updatedAt
    }
  : null;

const buscarCardapioCompleto = (data) => Cardapio.findOne({
  where: { data },
  include: [{ model: Ingrediente, attributes: ['id', 'nome'], order: [['nome', 'ASC']] }]
});

const valorPredefinicao = (predefinicao, data) => {
  const campo = CAMPO_PREDEFINICAO_POR_DIA[diaDaSemana(data)];
  if (!campo || !predefinicao) return null;
  return {
    vaiComer: Boolean(predefinicao[campo]),
    porcao: predefinicao[campo] ? predefinicao.porcaoPadrao : null
  };
};

async function sincronizarPredefinicoesParaCardapio(cardapio, transaction) {
  const campo = CAMPO_PREDEFINICAO_POR_DIA[diaDaSemana(cardapio.data)];
  if (!campo) return;
  const hoje = obterDataBrasilia().data;
  if (cardapio.data < hoje) return;
  if (cardapio.data === hoje && prazoExpirado(cardapio.data)) return;

  const [predefinicoes, pedidosExistentes] = await Promise.all([
    Predefinicao.findAll({ transaction }),
    Pedido.findAll({ where: { cardapioId: cardapio.id }, transaction })
  ]);
  const porUsuario = new Map(pedidosExistentes.map((pedido) => [pedido.usuarioId, pedido]));
  const paraAtualizar = [];
  const paraCriar = [];

  for (const predefinicao of predefinicoes) {
    const regra = valorPredefinicao(predefinicao, cardapio.data);
    if (!regra) continue;
    const existente = porUsuario.get(predefinicao.usuarioId);
    if (existente?.origem === 'MANUAL') continue;
    const dados = {
      id: existente?.id,
      usuarioId: predefinicao.usuarioId,
      cardapioId: cardapio.id,
      vaiComer: regra.vaiComer,
      porcao: regra.porcao,
      origem: 'PREDEFINICAO'
    };
    if (existente) paraAtualizar.push(dados);
    else paraCriar.push(dados);
  }

  if (paraAtualizar.length) {
    await Pedido.bulkCreate(paraAtualizar, {
      transaction,
      updateOnDuplicate: ['vaiComer', 'porcao', 'origem', 'updatedAt']
    });
  }
  if (paraCriar.length) {
    await Pedido.bulkCreate(paraCriar.map(({ id: _id, ...dados }) => dados), { transaction });
  }
}

async function sincronizarPredefinicaoDoAluno(predefinicao, transaction) {
  const hoje = obterDataBrasilia().data;
  const cardapios = await Cardapio.findAll({ where: { data: { [Op.gte]: hoje } }, transaction });
  const idsCardapio = cardapios.map((cardapio) => cardapio.id);
  if (!idsCardapio.length) return;

  const pedidosExistentes = await Pedido.findAll({
    where: { usuarioId: predefinicao.usuarioId, cardapioId: { [Op.in]: idsCardapio } },
    transaction
  });
  const porCardapio = new Map(pedidosExistentes.map((pedido) => [pedido.cardapioId, pedido]));
  const paraAtualizar = [];
  const paraCriar = [];

  for (const cardapio of cardapios) {
    if (cardapio.data === hoje && prazoExpirado(cardapio.data)) continue;
    const regra = valorPredefinicao(predefinicao, cardapio.data);
    if (!regra) continue;
    const existente = porCardapio.get(cardapio.id);
    if (existente?.origem === 'MANUAL') continue;
    const dados = {
      id: existente?.id,
      usuarioId: predefinicao.usuarioId,
      cardapioId: cardapio.id,
      vaiComer: regra.vaiComer,
      porcao: regra.porcao,
      origem: 'PREDEFINICAO'
    };
    if (existente) paraAtualizar.push(dados);
    else paraCriar.push(dados);
  }

  if (paraAtualizar.length) {
    await Pedido.bulkCreate(paraAtualizar, {
      transaction,
      updateOnDuplicate: ['vaiComer', 'porcao', 'origem', 'updatedAt']
    });
  }
  if (paraCriar.length) {
    await Pedido.bulkCreate(paraCriar.map(({ id: _id, ...dados }) => dados), { transaction });
  }
}

async function recalcularResumo(data) {
  const cardapio = await Cardapio.findOne({ where: { data }, attributes: ['id'] });
  const totalAlunos = await User.count({ where: { tipoUsuario: 'ALUNO' } });
  if (!cardapio) {
    return {
      data,
      temCardapio: false,
      totalAlunos,
      totalRespostas: 0,
      naoResponderam: 0,
      contagem: { naoVaoComer: 0, '200g': 0, '300g': 0, '400g': 0, '500g': 0 },
      percentuais: { naoVaoComer: 0, naoResponderam: 0, '200g': 0, '300g': 0, '400g': 0, '500g': 0, refeicoes: 0 },
      totalRefeicoes: 0,
      totalGramas: 0,
      totalQuilos: 0
    };
  }
  const pedidos = await Pedido.findAll({ where: { cardapioId: cardapio.id } });
  const contagem = { naoVaoComer: 0, '200g': 0, '300g': 0, '400g': 0, '500g': 0 };
  for (const pedido of pedidos) {
    if (!pedido.vaiComer) contagem.naoVaoComer += 1;
    else if (PORCOES_VALIDAS.includes(pedido.porcao)) contagem[pedido.porcao] += 1;
  }
  const totalRefeicoes = contagem['200g'] + contagem['300g'] + contagem['400g'] + contagem['500g'];
  const totalGramas = contagem['200g'] * 200 + contagem['300g'] * 300 + contagem['400g'] * 400 + contagem['500g'] * 500;
  const percentual = (quantidade) => totalAlunos ? Number(((quantidade / totalAlunos) * 100).toFixed(1)) : 0;
  const naoResponderam = Math.max(0, totalAlunos - pedidos.length);
  return {
    data,
    temCardapio: true,
    totalAlunos,
    totalRespostas: pedidos.length,
    naoResponderam,
    contagem,
    percentuais: {
      naoVaoComer: percentual(contagem.naoVaoComer),
      naoResponderam: percentual(naoResponderam),
      '200g': percentual(contagem['200g']),
      '300g': percentual(contagem['300g']),
      '400g': percentual(contagem['400g']),
      '500g': percentual(contagem['500g']),
      refeicoes: percentual(totalRefeicoes)
    },
    totalRefeicoes,
    totalGramas,
    totalQuilos: totalGramas / 1000
  };
}

/* -------------------------------- Autenticação -------------------------------- */

app.post('/api/v1/autenticacao/aluno/cadastro', async (req, res, next) => {
  try {
    const dados = schemaCadastro.parse(req.body);
    const email = normalizarEmail(dados.email);
    const existeRM = await User.findOne({ where: { RM: dados.RM } });
    if (existeRM) return respostaErro(res, 409, 'Já existe um aluno cadastrado com esse RM.');
    const existeEmail = await User.findOne({ where: { email } });
    if (existeEmail) return respostaErro(res, 409, 'Já existe um usuário cadastrado com esse e-mail.');
    const senha = await bcrypt.hash(dados.senha, LIMITE_HASH_BCRYPT);
    await User.create({ RM: dados.RM, nome: dados.nome, email, senha, tipoUsuario: 'ALUNO' });
    return res.status(201).json({ mensagem: 'Cadastro realizado com sucesso.' });
  } catch (error) { next(error); }
});

async function processarLogin(usuario, senha, res, mensagemUsuarioInexistente) {
  res.setHeader('Cache-Control', 'no-store');
  if (!usuario) {
    await bcrypt.compare(senha, DUMMY_PASSWORD_HASH);
    return respostaErro(res, 401, mensagemUsuarioInexistente);
  }

  const transaction = await sequelize.transaction();
  try {
    const atual = await User.findByPk(usuario.id, {
      transaction,
      lock: databaseDialect === 'sqlite' ? undefined : transaction.LOCK.UPDATE
    });
    if (!atual) {
      await transaction.rollback();
      return respostaErro(res, 401, 'Senha incorreta.');
    }

    const agora = new Date();
    if (atual.bloqueadoAte && atual.bloqueadoAte > agora) {
      const minutos = Math.max(1, Math.ceil((atual.bloqueadoAte.getTime() - agora.getTime()) / 60000));
      await transaction.rollback();
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((atual.bloqueadoAte.getTime() - agora.getTime()) / 1000))));
      return respostaErro(res, 429, `Muitas tentativas incorretas. Tente novamente em ${minutos} minuto(s).`);
    }

    if (atual.bloqueadoAte && atual.bloqueadoAte <= agora) {
      atual.bloqueadoAte = null;
      atual.tentativasLogin = 0;
    }

    const senhaValida = await bcrypt.compare(senha, atual.senha);
    if (!senhaValida) {
      atual.tentativasLogin += 1;
      if (atual.tentativasLogin >= 5) {
        atual.tentativasLogin = 5;
        atual.bloqueadoAte = new Date(Date.now() + 15 * 60 * 1000);
      }
      await atual.save({ transaction });
      await transaction.commit();
      if (atual.bloqueadoAte) {
        res.setHeader('Retry-After', '900');
        return respostaErro(res, 429, 'Muitas tentativas incorretas. Sua conta foi bloqueada por 15 minutos.');
      }
      return respostaErro(res, 401, 'Senha incorreta.');
    }

    atual.tentativasLogin = 0;
    atual.bloqueadoAte = null;
    await atual.save({ transaction });
    await transaction.commit();
    definirCookieSessao(res, atual);
    return res.json({ id: atual.id, RM: atual.RM, nome: atual.nome, email: atual.email, tipoUsuario: atual.tipoUsuario });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

app.post('/api/v1/autenticacao/aluno/login', limiterLogin, async (req, res, next) => {
  try {
    const dados = schemaLoginAluno.parse(req.body);
    const usuario = await User.findOne({ where: { RM: dados.RM, tipoUsuario: 'ALUNO' } });
    await processarLogin(usuario, dados.senha, res, 'RM ou senha incorretos.');
  } catch (error) { next(error); }
});

app.post('/api/v1/autenticacao/cozinha/login', limiterLogin, async (req, res, next) => {
  try {
    const dados = schemaLoginCozinha.parse(req.body);
    const usuario = await User.findOne({ where: { email: normalizarEmail(dados.email), tipoUsuario: 'COZINHA' } });
    await processarLogin(usuario, dados.senha, res, 'E-mail ou senha incorretos.');
  } catch (error) { next(error); }
});

app.post('/api/v1/autenticacao/logout', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  invalidarCookieSessao(res);
  res.status(204).send();
});

app.get('/api/v1/sessao', autenticar, (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ usuario: { id: req.usuario.id, RM: req.usuario.RM, nome: req.usuario.nome, email: req.usuario.email, tipoUsuario: req.usuario.tipoUsuario } });
});

app.post('/api/v1/autenticacao/esqueci-senha', limiterRecuperacao, async (req, res, next) => {
  const mensagem = 'Se o e-mail estiver cadastrado, enviamos instruções para recuperação da senha.';
  try {
    const resultadoEmail = z.string().trim().email().max(254).safeParse(req.body?.email);
    if (!resultadoEmail.success) return respostaErro(res, 400, 'Informe um e-mail válido.');
    const email = normalizarEmail(resultadoEmail.data);
    const usuario = await User.findOne({ where: { email, tipoUsuario: 'ALUNO' } });
    if (!usuario) return res.status(200).json({ mensagem });

    await RecuperacaoSenha.destroy({ where: { usuarioId: usuario.id } });
    const token = createResetToken();
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await RecuperacaoSenha.create({
      usuarioId: usuario.id,
      tokenHash,
      expiraEm: new Date(Date.now() + resetTokenTTL)
    });

    const linkBase = FRONTEND_URLS[0] || 'http://localhost:5173';
    const link = `${linkBase.replace(/\/$/, '')}/redefinir-senha?token=${encodeURIComponent(token)}`;
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'Sistema de Cozinha <nao-responda@localhost>',
        to: usuario.email,
        subject: 'Recuperação de senha — Sistema de Cozinha',
        text: `Olá, ${usuario.nome}.\n\nAcesse o link abaixo para redefinir sua senha. Ele expira em 30 minutos e pode ser usado uma única vez:\n\n${link}`
      });
      if (!process.env.SMTP_HOST) console.log(`[e-mail de desenvolvimento] Link de recuperação: ${link}`);
    } catch (emailError) {
      console.error('Falha no envio do e-mail de recuperação:', emailError);
    }

    return res.status(200).json({ mensagem });
  } catch (error) { next(error); }
});

app.post('/api/v1/autenticacao/redefinir-senha', async (req, res, next) => {
  try {
    const { token, senha } = z.object({ token: z.string().min(20), senha: z.string().min(8).max(128) }).parse(req.body);
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const registro = await RecuperacaoSenha.findOne({ where: { tokenHash: hash } });
    if (!registro || registro.usadoEm || new Date(registro.expiraEm) < new Date()) {
      if (registro) await registro.destroy();
      return respostaErro(res, 400, 'O link de recuperação é inválido ou expirou.');
    }
    const usuario = await User.findByPk(registro.usuarioId);
    if (!usuario || usuario.tipoUsuario !== 'ALUNO') return respostaErro(res, 400, 'O link de recuperação é inválido ou expirou.');
    usuario.senha = await bcrypt.hash(senha, LIMITE_HASH_BCRYPT);
    usuario.tentativasLogin = 0;
    usuario.bloqueadoAte = null;
    usuario.versaoSessao += 1;
    await usuario.save();
    await RecuperacaoSenha.destroy({ where: { usuarioId: usuario.id } });
    res.json({ mensagem: 'Senha redefinida com sucesso.' });
  } catch (error) { next(error); }
});

/* ----------------------------------- Perfil ----------------------------------- */

app.get('/api/v1/aluno/perfil', autenticar, exigirAluno, (req, res) => {
  res.json({ id: req.usuario.id, RM: req.usuario.RM, nome: req.usuario.nome, email: req.usuario.email });
});

app.put('/api/v1/aluno/perfil', autenticar, exigirAluno, async (req, res, next) => {
  try {
    const dados = schemaPerfil.parse(req.body);
    const email = normalizarEmail(dados.email);
    const outro = await User.findOne({ where: { email, id: { [Op.ne]: req.usuario.id } } });
    if (outro) return respostaErro(res, 409, 'Esse e-mail já está sendo usado por outro usuário.');
    req.usuario.nome = dados.nome;
    req.usuario.email = email;
    if (dados.senha) {
      req.usuario.senha = await bcrypt.hash(dados.senha, LIMITE_HASH_BCRYPT);
      req.usuario.versaoSessao += 1;
      await RecuperacaoSenha.destroy({ where: { usuarioId: req.usuario.id } });
    }
    await req.usuario.save();
    if (dados.senha) invalidarCookieSessao(res);
    else definirCookieSessao(res, req.usuario);
    res.json({ id: req.usuario.id, RM: req.usuario.RM, nome: req.usuario.nome, email: req.usuario.email });
  } catch (error) { next(error); }
});

/* ---------------------------------- Cardápio ---------------------------------- */

async function endpointCardapio(req, res, next) {
  try {
    if (!validarDataISO(req.params.data)) return respostaErro(res, 400, 'Data inválida.');
    if (req.usuario?.tipoUsuario === 'ALUNO' && req.params.data < obterDataBrasilia().data) {
      return respostaErro(res, 403, 'Alunos não podem consultar dias anteriores.');
    }
    const cardapio = await buscarCardapioCompleto(req.params.data);
    res.setHeader('Cache-Control', 'no-store');
    res.json(serializarCardapio(cardapio));
  } catch (error) { next(error); }
}
app.get('/api/v1/cardapios/:data', autenticar, endpointCardapio);

app.get('/api/v1/cardapios', autenticar, exigirCozinha, async (req, res, next) => {
  try {
    const datas = String(req.query.datas || '').split(',').map((d) => d.trim()).filter(Boolean);
    const validas = datas.filter(validarDataISO);
    const existentes = await Cardapio.findAll({ where: { data: { [Op.in]: validas } }, attributes: ['data'] });
    res.setHeader('Cache-Control', 'no-store');
    res.json(existingToSortedStrings(existentes.map((item) => item.data)));
  } catch (error) { next(error); }
});

function existingToSortedStrings(values) {
  return [...new Set(values)].sort();
}

app.post('/api/v1/cardapios', autenticar, exigirCozinha, upload.single('imagem'), async (req, res, next) => {
  try {
    const data = String(req.body?.data || '');
    if (!validarDataISO(data)) return respostaErro(res, 400, 'Data inválida.');
    if (!ehDiaUtil(data)) {
      return respostaErro(res, 422, 'Sábado e domingo não possuem almoço disponível.');
    }    
    if (!podeEditarCardapio(data)) return respostaErro(res, 403, 'O horário para alterar o cardápio deste dia já passou.');

    let nomesRecebidos;
    try { nomesRecebidos = JSON.parse(String(req.body?.ingredientes || '[]')); }
    catch { return respostaErro(res, 400, 'Ingredientes inválidos.'); }
    if (!Array.isArray(nomesRecebidos) || nomesRecebidos.some((nome) => typeof nome !== 'string')) return respostaErro(res, 400, 'Ingredientes inválidos.');
    if (nomesRecebidos.some((nome) => normalizarNomeIngrediente(nome).length > 100)) return respostaErro(res, 400, 'Cada ingrediente pode ter no máximo 100 caracteres.');
    const nomes = [];
    const chavesVistas = new Set();

    for (const valor of nomesRecebidos) {
      const nome = normalizarNomeIngrediente(valor);
      if (!nome) continue;

      const chave = normalizarChaveIngrediente(nome);

      if (chavesVistas.has(chave)) continue;

      chavesVistas.add(chave);
      nomes.push(nome);
    }  
    
        if (nomes.length === 0) return respostaErro(res, 400, 'Cadastre pelo menos um ingrediente.');
        if (nomes.length > 50) return respostaErro(res, 400, 'O almoço pode ter no máximo 50 ingredientes.');

    const existente = await Cardapio.findOne({ where: { data } });
    const imagemAnterior = existente?.imagemUrl || null;
    let imagemUrl = imagemAnterior;
    let imagemNovaGerada = null;
    if (req.file) {
      const ext = '.jpg';
      const nomeArquivo = `${crypto.randomUUID()}${ext}`;
      const destino = path.join(uploadsDir, nomeArquivo);
      imagemNovaGerada = nomeArquivo;
      try {
        await sharp(req.file.buffer, { limitInputPixels: 40_000_000 })
          .rotate()
          .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 82, mozjpeg: true })
          .toFile(destino);
      } catch {
        try { await fs.unlink(destino); } catch {}
        imagemNovaGerada = null;
        return respostaErro(res, 400, 'A imagem enviada não é válida ou não pôde ser processada.');
      }
      imagemUrl = `/uploads/${nomeArquivo}`;
    }
    if (!imagemUrl) return respostaErro(res, 400, 'Adicione uma foto do almoço.');

    const transaction = await sequelize.transaction();
    let cardapio;
    try {
      cardapio = existente
        ? await existente.update({ imagemUrl }, { transaction })
        : await Cardapio.create({ data, imagemUrl }, { transaction });
      await Ingrediente.destroy({ where: { cardapioId: cardapio.id }, transaction });
      await Ingrediente.bulkCreate(nomes.map((nome) => ({ cardapioId: cardapio.id, nome, nomeNormalizado: normalizarChaveIngrediente(nome) })), { transaction });
      await sincronizarPredefinicoesParaCardapio(cardapio, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      if (imagemNovaGerada) {
        try { await fs.unlink(path.join(uploadsDir, imagemNovaGerada)); } catch {}
      }
      throw error;
    }

    if (imagemAnterior && req.file) await removerImagemAnterior(imagemAnterior, imagemUrl);
    const completo = await buscarCardapioCompleto(data);
    io.emit('cardapio:atualizado', serializarCardapio(completo));
    io.to('cozinha').emit('resumo:atualizar', { data });
    res.status(existente ? 200 : 201).json(serializarCardapio(completo));
  } catch (error) { next(error); }
});

async function removerImagemAnterior(imagemAntiga, imagemNova) {
  if (!imagemAntiga || imagemAntiga === imagemNova || !imagemAntiga.startsWith('/uploads/')) return;
  const arquivo = path.join(uploadsDir, path.basename(imagemAntiga));
  try { await fs.unlink(arquivo); } catch {}
}

app.put('/api/v1/cardapios/:data/sobra', autenticar, exigirCozinha, async (req, res, next) => {
  try {
    if (!validarDataISO(req.params.data)) return respostaErro(res, 400, 'Data inválida.');
    const dados = schemaSobra.parse(req.body);
    const hoje = obterDataBrasilia().data;
    if (req.params.data !== hoje) return respostaErro(res, 403, req.params.data < hoje ? 'Datas anteriores são somente para consulta.' : 'A sobra só pode ser registrada no dia do almoço.');
    const cardapio = await Cardapio.findOne({ where: { data: req.params.data } });
    if (!cardapio) return respostaErro(res, 404, 'Cardápio dessa data ainda não foi cadastrado.');
    cardapio.sobraKg = dados.sobraKg;
    await cardapio.save();
    io.to('cozinha').emit('cardapio:sobraAtualizada', { data: cardapio.data, sobraKg: dados.sobraKg });
    res.json({ sobraKg: dados.sobraKg });
  } catch (error) { next(error); }
});

/* ----------------------------------- Pedido ----------------------------------- */

app.get('/api/v1/aluno/pedido/:data', autenticar, exigirAluno, async (req, res, next) => {
  try {
    if (!validarDataISO(req.params.data)) return respostaErro(res, 400, 'Data inválida.');
    if (req.params.data < obterDataBrasilia().data) return respostaErro(res, 403, 'Alunos não podem consultar dias anteriores.');
    res.setHeader('Cache-Control', 'no-store');
    const pedido = await Pedido.findOne({ where: { usuarioId: req.usuario.id }, include: [{ model: Cardapio, where: { data: req.params.data } }] });
    res.json(pedido ? { vaiComer: pedido.vaiComer, porcao: pedido.porcao, origem: pedido.origem } : null);
  } catch (error) { next(error); }
});

app.post('/api/v1/aluno/pedidos', autenticar, exigirAluno, async (req, res, next) => {
  try {
    const dados = schemaPedido.parse(req.body);
    if (prazoExpirado(dados.data)) return respostaErro(res, 403, 'O prazo para confirmar o almoço deste dia terminou às 10:30.');
    const cardapio = await buscarCardapioCompleto(dados.data);
    if (!cardapio || !cardapio.imagemUrl || !cardapio.Ingredientes?.length) return respostaErro(res, 409, 'Não há almoço disponível para este dia.');

    const predefinicao = await Predefinicao.findOne({ where: { usuarioId: req.usuario.id } });
    const regraPredef = valorPredefinicao(predefinicao, dados.data);
    const correspondeARegra = regraPredef && regraPredef.vaiComer === dados.vaiComer && regraPredef.porcao === (dados.vaiComer ? dados.porcao : null);
    const origem = correspondeARegra ? 'PREDEFINICAO' : 'MANUAL';

    await Pedido.upsert({
      usuarioId: req.usuario.id,
      cardapioId: cardapio.id,
      vaiComer: dados.vaiComer,
      porcao: dados.vaiComer ? dados.porcao : null,
      origem
    }, { conflictFields: ['usuarioId', 'cardapioId'] });
    const pedido = await Pedido.findOne({ where: { usuarioId: req.usuario.id, cardapioId: cardapio.id } });
    io.to('cozinha').emit('resumo:atualizar', { data: dados.data });
    res.status(200).json({ vaiComer: pedido.vaiComer, porcao: pedido.porcao, origem: pedido.origem });
  } catch (error) { next(error); }
});

app.post('/api/v1/aluno/pedidos/:data/reaplicar-predefinicao', autenticar, exigirAluno, async (req, res, next) => {
  try {
    const data = req.params.data;
    if (!validarDataISO(data) || !ehDiaUtil(data)) return respostaErro(res, 400, 'Data inválida ou sem almoço.');
    if (prazoExpirado(data)) return respostaErro(res, 403, 'O prazo para alterar o pedido deste dia terminou às 10:30.');
    const cardapio = await buscarCardapioCompleto(data);
    if (!cardapio) return respostaErro(res, 404, 'Não há almoço disponível para este dia.');
    const predefinicao = await Predefinicao.findOne({ where: { usuarioId: req.usuario.id } });
    const regra = valorPredefinicao(predefinicao, data);
    if (!regra) return respostaErro(res, 400, 'Não existe pré-definição para este dia.');
    await Pedido.upsert({
      usuarioId: req.usuario.id,
      cardapioId: cardapio.id,
      vaiComer: regra.vaiComer,
      porcao: regra.porcao,
      origem: 'PREDEFINICAO'
    }, { conflictFields: ['usuarioId', 'cardapioId'] });
    const pedido = await Pedido.findOne({ where: { usuarioId: req.usuario.id, cardapioId: cardapio.id } });
    io.to('cozinha').emit('resumo:atualizar', { data });
    res.json({ vaiComer: pedido.vaiComer, porcao: pedido.porcao, origem: pedido.origem });
  } catch (error) { next(error); }
});

app.get('/api/v1/cozinha/pedidos/:data', autenticar, exigirCozinha, async (req, res, next) => {
  try {
    if (!validarDataISO(req.params.data)) return respostaErro(res, 400, 'Data inválida.');
    res.setHeader('Cache-Control', 'no-store');
    const cardapio = await Cardapio.findOne({ where: { data: req.params.data } });
    if (!cardapio) return res.json([]);
    const pedidos = await Pedido.findAll({ where: { cardapioId: cardapio.id }, include: [{ model: User, attributes: ['RM', 'nome'] }] });
    res.json(pedidos.map((pedido) => ({ RM: pedido.User?.RM, nome: pedido.User?.nome, vaiComer: pedido.vaiComer, porcao: pedido.porcao, origem: pedido.origem, atualizadoEm: pedido.updatedAt })));
  } catch (error) { next(error); }
});

app.get('/api/v1/cozinha/resumos/:data', autenticar, exigirCozinha, async (req, res, next) => {
  try {
    if (!validarDataISO(req.params.data)) return respostaErro(res, 400, 'Data inválida.');
    res.setHeader('Cache-Control', 'no-store');
    res.json(await recalcularResumo(req.params.data));
  } catch (error) { next(error); }
});

/* ------------------------------- Pré-definição ------------------------------- */

app.get('/api/v1/aluno/predefinicao', autenticar, exigirAluno, async (req, res, next) => {
  try {
    const predefinicao = await Predefinicao.findOne({ where: { usuarioId: req.usuario.id } });
    res.json(predefinicao ? {
      segunda: predefinicao.segunda,
      terca: predefinicao.terca,
      quarta: predefinicao.quarta,
      quinta: predefinicao.quinta,
      sexta: predefinicao.sexta,
      porcaoPadrao: predefinicao.porcaoPadrao
    } : null);
  } catch (error) { next(error); }
});

app.put('/api/v1/aluno/predefinicao', autenticar, exigirAluno, async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const dados = schemaPredefinicao.parse(req.body);
    const [predefinicao] = await Predefinicao.findOrCreate({ where: { usuarioId: req.usuario.id }, defaults: { usuarioId: req.usuario.id, ...dados }, transaction });
    Object.assign(predefinicao, dados);
    await predefinicao.save({ transaction });
    await sincronizarPredefinicaoDoAluno(predefinicao, transaction);
    await transaction.commit();
    io.to('cozinha').emit('resumos:atualizarTudo');
    res.json(dados);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
});

app.get('/api/v1/saude', (_req, res) => res.json({ status: 'ok' }));

app.use((error, _req, res, _next) => {
  if (error instanceof z.ZodError) {
    const mensagem = error.issues?.[0]?.message || 'Dados inválidos.';
    return respostaErro(res, 400, mensagem);
  }
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') return respostaErro(res, 400, 'A imagem deve ter no máximo 8 MB.');
    return respostaErro(res, 400, 'Não foi possível receber a imagem.');
  }
  if (error?.message === 'A imagem deve estar no formato JPG, JPEG ou PNG.') {
    return respostaErro(res, 400, error.message);
  }
  if (error?.name === 'SequelizeUniqueConstraintError') {
    return respostaErro(res, 409, 'Os dados informados já estão cadastrados.');
  }
  console.error('Erro interno da API:', error);
  return respostaErro(res, 500, 'Erro interno do servidor.');
});

/* -------------------------------- Socket.IO -------------------------------- */

io.use(async (socket, next) => {
  try {
    const raw = socket.handshake.headers.cookie || '';
    const cookies = Object.fromEntries(raw.split(';').map((item) => {
      const index = item.indexOf('=');
      if (index === -1) return null;
      const key = decodificarCookie(item.slice(0, index).trim());
      const value = decodificarCookie(item.slice(index + 1).trim());
      return key ? [key, value] : null;
    }).filter(Boolean));
    const token = cookies[COOKIE_NAME];
    if (!token) return next(new Error('unauthorized'));
    const payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'sistema-cozinha-etec-bento-quirino' });
    const usuario = await User.findByPk(Number(payload.sub));
    if (!usuario || usuario.versaoSessao !== Number(payload.versaoSessao)) return next(new Error('unauthorized'));
    socket.data.usuario = usuario;
    next();
  } catch { next(new Error('unauthorized')); }
});

io.on('connection', (socket) => {
  if (socket.data.usuario.tipoUsuario === 'COZINHA') socket.join('cozinha');
});

export { app, io, sequelize, User, Cardapio, Ingrediente, Pedido, Predefinicao, RecuperacaoSenha };

async function iniciar() {
  await fs.mkdir(uploadsDir, { recursive: true });
  await sequelize.authenticate();
  if (process.env.NODE_ENV === 'development' && databaseDialect === 'sqlite' && process.env.ALLOW_SYNC === 'true') {
    await sequelize.sync();
  }

  const emailCozinha = normalizarEmail(process.env.COZINHA_EMAIL);
  const senhaCozinha = process.env.COZINHA_SENHA;
  let cozinha = await User.findOne({ where: { tipoUsuario: 'COZINHA' } });

  if (!cozinha) {
    cozinha = await User.create({
      RM: null,
      nome: process.env.COZINHA_NOME || 'Cozinha ETEC Bento Quirino',
      email: emailCozinha,
      senha: await bcrypt.hash(senhaCozinha, LIMITE_HASH_BCRYPT),
      tipoUsuario: 'COZINHA'
    });
  } else {
    let alterou = false;
    if (cozinha.nome !== (process.env.COZINHA_NOME || 'Cozinha ETEC Bento Quirino')) {
      cozinha.nome = process.env.COZINHA_NOME || 'Cozinha ETEC Bento Quirino';
      alterou = true;
    }
    if (cozinha.email !== emailCozinha) {
      const conflito = await User.findOne({ where: { email: emailCozinha, id: { [Op.ne]: cozinha.id } } });
      if (conflito) throw new Error('COZINHA_EMAIL já está sendo usado por outro usuário.');
      cozinha.email = emailCozinha;
      alterou = true;
    }
    if (!(await bcrypt.compare(senhaCozinha, cozinha.senha))) {
      cozinha.senha = await bcrypt.hash(senhaCozinha, LIMITE_HASH_BCRYPT);
      cozinha.versaoSessao += 1;
      alterou = true;
    }
    if (alterou) await cozinha.save();
  }
  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      io.attach(server);
      console.log(`API rodando em http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  iniciar().catch((error) => {
    console.error('Falha ao iniciar a API:', error);
    process.exit(1);
  });
}
