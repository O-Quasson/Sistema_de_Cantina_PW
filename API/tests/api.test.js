import { beforeAll, afterAll, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import request from 'supertest';

process.env.NODE_ENV = 'test';
process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = path.join(process.cwd(), 'database.test.sqlite');
process.env.JWT_SECRET = 'chave-de-teste-com-mais-de-32-caracteres-segura';
process.env.COZINHA_EMAIL = 'cozinha@teste.local';
process.env.COZINHA_SENHA = 'senha-cozinha-teste';
process.env.FRONTEND_URL = 'http://localhost:5173';

afterAll(async () => {
  const { sequelize } = await import('../server.js');
  await sequelize.close();
  await fs.rm(path.join(process.cwd(), 'database.test.sqlite'), { force: true });
  const uploadDir = path.join(process.cwd(), 'uploads');
  for (const nome of await fs.readdir(uploadDir).catch(() => [])) {
    if (nome !== '.gitkeep') await fs.rm(path.join(uploadDir, nome), { force: true });
  }
});

const png1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64');
const dataSegundaFutura = '2099-01-05';

async function ambienteLimpo() {
  const mod = await import('../server.js');
  await mod.sequelize.sync({ force: true });
  await mod.User.create({
    nome: 'Cozinha Teste',
    email: process.env.COZINHA_EMAIL,
    senha: await (await import('bcryptjs')).default.hash(process.env.COZINHA_SENHA, 4),
    tipoUsuario: 'COZINHA'
  });
  await mod.User.create({
    RM: 12345,
    nome: 'Aluno Teste',
    email: 'aluno@teste.local',
    senha: await (await import('bcryptjs')).default.hash('senha-aluno', 4),
    tipoUsuario: 'ALUNO'
  });
  return mod;
}

async function loginAluno(app) {
  const agente = request.agent(app);
  const resposta = await agente.post('/api/v1/autenticacao/aluno/login').send({ RM: 12345, senha: 'senha-aluno' });
  expect(resposta.status).toBe(200);
  expect(resposta.headers['set-cookie']?.some((cookie) => cookie.startsWith('sessao='))).toBe(true);
  return agente;
}

async function loginCozinha(app) {
  const agente = request.agent(app);
  const resposta = await agente.post('/api/v1/autenticacao/cozinha/login').send({ email: process.env.COZINHA_EMAIL, senha: process.env.COZINHA_SENHA });
  expect(resposta.status).toBe(200);
  return agente;
}

describe('regras críticas do sistema de cozinha', () => {
  let app;
  let mod;

  beforeEach(async () => {
    mod = await ambienteLimpo();
    app = mod.app;
  });

  it('impede aluno de consultar data anterior', async () => {
    const aluno = await loginAluno(app);
    const resposta = await aluno.get('/api/v1/cardapios/2000-01-03');
    expect(resposta.status).toBe(403);
  });

  it('impede pedido quando não existe cardápio e não conta não-resposta em dia sem almoço', async () => {
    const aluno = await loginAluno(app);
    const resposta = await aluno.post('/api/v1/aluno/pedidos').send({ data: dataSegundaFutura, vaiComer: true, porcao: '300g' });
    expect(resposta.status).toBe(409);
    const cozinha = await loginCozinha(app);
    const resumo = await cozinha.get(`/api/v1/cozinha/resumos/${dataSegundaFutura}`);
    expect(resumo.body.temCardapio).toBe(false);
    expect(resumo.body.naoResponderam).toBe(0);
  });


  it('mantém autorização separada entre aluno e cozinha', async () => {
    const aluno = await loginAluno(app);
    const cozinha = await loginCozinha(app);

    expect((await aluno.get('/api/v1/cozinha/resumos/2099-01-05')).status).toBe(403);
    expect((await cozinha.get('/api/v1/aluno/predefinicao')).status).toBe(403);
    expect((await cozinha.post('/api/v1/aluno/pedidos').send({ data: dataSegundaFutura, vaiComer: true, porcao: '200g' })).status).toBe(403);
  });

  it('cria cardápio com ingredientes únicos e responde automaticamente pela pré-definição', async () => {
    const aluno = await loginAluno(app);
    const cozinha = await loginCozinha(app);

    const predef = await aluno.put('/api/v1/aluno/predefinicao').send({ segunda: true, terca: false, quarta: false, quinta: false, sexta: false, porcaoPadrao: '300g' });
    expect(predef.status).toBe(200);

    const menu = await cozinha
      .post('/api/v1/cardapios')
      .field('data', dataSegundaFutura)
      .field('ingredientes', JSON.stringify(['Arroz', ' arroz ', 'FEIJÃO']))
      .attach('imagem', png1x1, { filename: 'almoco.png', contentType: 'image/png' });

    expect(menu.status).toBe(201);
    expect(menu.body.ingredientes.map((item) => item.nome)).toEqual(['Arroz', 'FEIJÃO']);

    const resumo = await cozinha.get(`/api/v1/cozinha/resumos/${dataSegundaFutura}`);
    expect(resumo.status).toBe(200);
    expect(resumo.body.temCardapio).toBe(true);
    expect(resumo.body['300g']).toBeUndefined();
    expect(resumo.body.contagem['300g']).toBe(1);
    expect(resumo.body.naoResponderam).toBe(0);
    expect(resumo.body.percentuais['300g']).toBe(100);
    expect(resumo.body.percentuais.refeicoes).toBe(100);
  });

  it('alteração manual sobrescreve pré-definição somente naquele dia e pode reaplicar a pré-definição', async () => {
    const aluno = await loginAluno(app);
    const cozinha = await loginCozinha(app);

    await aluno.put('/api/v1/aluno/predefinicao').send({ segunda: true, terca: false, quarta: false, quinta: false, sexta: false, porcaoPadrao: '300g' });
    await cozinha.post('/api/v1/cardapios').field('data', dataSegundaFutura).field('ingredientes', JSON.stringify(['Arroz'])).attach('imagem', png1x1, { filename: 'almoco.png', contentType: 'image/png' });

    const manual = await aluno.post('/api/v1/aluno/pedidos').send({ data: dataSegundaFutura, vaiComer: false, porcao: null });
    expect(manual.status).toBe(200);
    expect(manual.body.origem).toBe('MANUAL');

    const resumoManual = await cozinha.get(`/api/v1/cozinha/resumos/${dataSegundaFutura}`);
    expect(resumoManual.body.contagem.naoVaoComer).toBe(1);
    expect(resumoManual.body.totalRefeicoes).toBe(0);

    const reaplicar = await aluno.post(`/api/v1/aluno/pedidos/${dataSegundaFutura}/reaplicar-predefinicao`);
    expect(reaplicar.status).toBe(200);
    expect(reaplicar.body.origem).toBe('PREDEFINICAO');
    expect(reaplicar.body.porcao).toBe('300g');

    const resumoReaplicado = await cozinha.get(`/api/v1/cozinha/resumos/${dataSegundaFutura}`);
    expect(resumoReaplicado.body.contagem['300g']).toBe(1);
    expect(resumoReaplicado.body.contagem.naoVaoComer).toBe(0);
  });

  it('bloqueia login após cinco erros por 15 minutos', async () => {
    const agente = request.agent(app);
    for (let i = 0; i < 4; i += 1) {
      const resposta = await agente.post('/api/v1/autenticacao/aluno/login').send({ RM: 12345, senha: 'senha-errada' });
      expect(resposta.status).toBe(401);
    }
    const quinta = await agente.post('/api/v1/autenticacao/aluno/login').send({ RM: 12345, senha: 'senha-errada' });
    expect(quinta.status).toBe(429);
    const bloqueado = await agente.post('/api/v1/autenticacao/aluno/login').send({ RM: 12345, senha: 'senha-aluno' });
    expect(bloqueado.status).toBe(429);
  });

  it('não permite cardápio em fim de semana', async () => {
    const cozinha = await loginCozinha(app);
    const resposta = await cozinha
      .post('/api/v1/cardapios')
      .field('data', '2099-01-04')
      .field('ingredientes', JSON.stringify(['Arroz']))
      .attach('imagem', png1x1, { filename: 'almoco.png', contentType: 'image/png' });
    expect(resposta.status).toBe(422);
  });

  it('não deixa a cozinha alterar cardápio do dia após o limite', async () => {
    const cozinha = await loginCozinha(app);
    await mod.Cardapio.create({ data: '2020-01-02', imagemUrl: '/uploads/existente.jpg' });
    const resposta = await cozinha
      .post('/api/v1/cardapios')
      .field('data', '2020-01-02')
      .field('ingredientes', JSON.stringify(['Arroz']))
      .attach('imagem', png1x1, { filename: 'almoco.png', contentType: 'image/png' });
    expect(resposta.status).toBe(403);
  });
});
