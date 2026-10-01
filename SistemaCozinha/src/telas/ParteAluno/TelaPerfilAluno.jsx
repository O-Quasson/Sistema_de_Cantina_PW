import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../axios/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { OPCOES_QUANTIDADE } from '../../utils/datas.js';
import CampoSenha from '../../componentes/CampoSenha.jsx';
import '../../estilos/perfil.css';

const dias = [
  ['segunda', 'Segunda-feira'],
  ['terca', 'Terça-feira'],
  ['quarta', 'Quarta-feira'],
  ['quinta', 'Quinta-feira'],
  ['sexta', 'Sexta-feira']
];

function IconeUsuarioPerfil() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c.8-3.4 3.2-5.1 7-5.1s6.2 1.7 7 5.1" />
    </svg>
  );
}

export default function TelaPerfilAluno() {
  const { usuario, setUsuario } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [mensagemPerfil, setMensagemPerfil] = useState('');
  const [perfilSucesso, setPerfilSucesso] = useState(false);
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [diasSemana, setDiasSemana] = useState({ segunda: false, terca: false, quarta: false, quinta: false, sexta: false });
  const [porcaoPadrao, setPorcaoPadrao] = useState('200g');
  const [mensagemPredefinicao, setMensagemPredefinicao] = useState('');
  const [predefSucesso, setPredefSucesso] = useState(false);
  const [salvandoPredefinicao, setSalvandoPredefinicao] = useState(false);
  const [aberto, setAberto] = useState(true);

  useEffect(() => {
    if (!usuario?.id) return;
    let ativo = true;
    setCarregandoPerfil(true);
    Promise.all([
      api.get('/api/v1/aluno/perfil'),
      api.get('/api/v1/aluno/predefinicao').catch(() => ({ data: null }))
    ]).then(([perfil, predef]) => {
      if (!ativo) return;
      setNome(perfil.data.nome || '');
      setEmail(perfil.data.email || '');
      if (predef.data) {
        setDiasSemana({ segunda: !!predef.data.segunda, terca: !!predef.data.terca, quarta: !!predef.data.quarta, quinta: !!predef.data.quinta, sexta: !!predef.data.sexta });
        setPorcaoPadrao(predef.data.porcaoPadrao || '200g');
      }
    }).catch(() => {
      if (ativo) setMensagemPerfil('Não foi possível carregar seu perfil.');
    }).finally(() => {
      if (ativo) setCarregandoPerfil(false);
    });
    return () => { ativo = false; };
  }, [usuario?.id]);

  const salvarPerfil = async (event) => {
    event.preventDefault();
    setMensagemPerfil('');
    setPerfilSucesso(false);
    if (senha && senha.length < 8) return setMensagemPerfil('A nova senha deve ter pelo menos 8 caracteres.');
    if (senha !== confirmacao) return setMensagemPerfil('As senhas devem ser iguais.');
    setSalvandoPerfil(true);
    try {
      const resposta = await api.put('/api/v1/aluno/perfil', { nome, email, senha });
      if (senha) {
        setUsuario(null);
        navigate('/login', { state: { mensagem: 'Senha alterada com sucesso. Entre novamente no sistema.' } });
        return;
      }
      setUsuario(resposta.data);
      setMensagemPerfil('Perfil atualizado com sucesso.');
      setPerfilSucesso(true);
      setSenha('');
      setConfirmacao('');
    } catch (error) {
      setMensagemPerfil(error.response?.data?.erro || 'Não foi possível atualizar o perfil.');
      setPerfilSucesso(false);
    } finally {
      setSalvandoPerfil(false);
    }
  };

  const salvarPredefinicao = async (event) => {
    event.preventDefault();
    setMensagemPredefinicao('');
    setPredefSucesso(false);
    setSalvandoPredefinicao(true);
    try {
      await api.put('/api/v1/aluno/predefinicao', { ...diasSemana, porcaoPadrao });
      setMensagemPredefinicao('Pré-definição salva. Os próximos dias com cardápio foram sincronizados automaticamente.');
      setPredefSucesso(true);
    } catch (error) {
      setMensagemPredefinicao(error.response?.data?.erro || 'Não foi possível salvar a pré-definição.');
    } finally {
      setSalvandoPredefinicao(false);
    }
  };

  if (carregandoPerfil) {
    return <main className="perfil-page"><div className="perfil-content"><div className="status-box-perfil">Carregando perfil...</div></div></main>;
  }

  return (
    <main className="perfil-page">
      <div className="perfil-content">
        <h1 className="title-script">Perfil</h1>

        <form className="card-profile" onSubmit={salvarPerfil}>
          <div className="avatar-circle" aria-hidden="true"><IconeUsuarioPerfil /></div>
          <div className="profile-badge">Aluno</div>

          <div className="form-group">
            <label className="field-label" htmlFor="rm">RM</label>
            <input id="rm" className="input-field" value={usuario?.RM ?? ''} readOnly />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="nome">Nome completo</label>
            <input id="nome" className="input-field" value={nome} onChange={(event) => setNome(event.target.value)} maxLength={120} required />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="email">E-mail</label>
            <input id="email" type="email" className="input-field" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={254} required autoComplete="email" />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="senha">Nova senha</label>
            <CampoSenha id="senha" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="Deixe em branco para manter" required={false} autoComplete="new-password" minLength={8} maxLength={128} />
            <p className="perfil-senha-help">Preencha somente se quiser trocar a senha.</p>
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="confirmacao">Confirmar nova senha</label>
            <CampoSenha id="confirmacao" value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} placeholder="Repita a nova senha" required={false} autoComplete="new-password" minLength={8} maxLength={128} />
          </div>

          <button className="btn-editar" type="submit" disabled={salvandoPerfil}>{salvandoPerfil ? 'Salvando...' : 'Salvar dados'}</button>
          {mensagemPerfil && <p className={`mensagem-perfil ${perfilSucesso ? 'sucesso' : ''}`} role={perfilSucesso ? 'status' : 'alert'}>{mensagemPerfil}</p>}
        </form>

        <form className="predefinir-card-wrapper" onSubmit={salvarPredefinicao}>
          <button type="button" className="card-header-banner" onClick={() => setAberto((atual) => !atual)} aria-expanded={aberto}>
            <span className="title-script inner-title">Predefinir Almoço</span>
            <span className="card-header-action" aria-hidden="true">{aberto ? '−' : '+'}</span>
          </button>
          {aberto && (
            <div className="dias-container">
              <p className="predefinicao-help">Marque os dias em que você vai almoçar. Nos dias desmarcados, a pré-definição será "não vou almoçar". Quando houver cardápio, o sistema responderá automaticamente.</p>
              <div className="form-group">
                <label className="field-label" htmlFor="porcaoPadrao">Porção padrão</label>
                <select id="porcaoPadrao" className="input-field" value={porcaoPadrao} onChange={(event) => setPorcaoPadrao(event.target.value)} disabled={salvandoPredefinicao}>
                  {OPCOES_QUANTIDADE.map((qtd) => <option key={qtd} value={qtd}>{qtd}</option>)}
                </select>
              </div>
              {dias.map(([campo, rotulo]) => (
                <label className="day-row" key={campo}>
                  <span className="day-label">{rotulo}</span>
                  <input className="day-check" type="checkbox" checked={diasSemana[campo]} onChange={() => setDiasSemana((atual) => ({ ...atual, [campo]: !atual[campo] }))} disabled={salvandoPredefinicao} />
                </label>
              ))}
              <button type="submit" className="btn-enviar-predefinicao" disabled={salvandoPredefinicao}>{salvandoPredefinicao ? 'Salvando...' : 'Salvar pré-definição'}</button>
              {mensagemPredefinicao && <p className={`mensagem-perfil ${predefSucesso ? 'sucesso' : ''}`} role={predefSucesso ? 'status' : 'alert'}>{mensagemPredefinicao}</p>}
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
