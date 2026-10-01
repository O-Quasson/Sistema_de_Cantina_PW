import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../axios/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import CampoSenha from '../componentes/CampoSenha.jsx';
import '../estilos/auth.css';

export default function Loginscreen() {
  const [tipo, setTipo] = useState('aluno');
  const [RM, setRM] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [bloqueado, setBloqueado] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [mensagemPagina, setMensagemPagina] = useState(location.state?.mensagem || '');
  const { setUsuario } = useAuth();

  useEffect(() => {
    setErro('');
    setBloqueado('');
    setSenha('');
  }, [tipo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro('');
    setBloqueado('');
    setCarregando(true);
    try {
      const endpoint = tipo === 'aluno'
        ? '/api/v1/autenticacao/aluno/login'
        : '/api/v1/autenticacao/cozinha/login';
      const payload = tipo === 'aluno' ? { RM, senha } : { email, senha };
      const resposta = await api.post(endpoint, payload);
      setUsuario(resposta.data);
      navigate(tipo === 'aluno' ? '/telainicialaluno' : '/telainicialcozinha');
    } catch (error) {
      const status = error.response?.status;
      const mensagem = error.response?.data?.erro || 'Não foi possível fazer login.';
      if (status === 429) setBloqueado(mensagem);
      else setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="auth-page">
      <h1 className="auth-title">Login</h1>
      <p className="auth-subtitle">Entre para acessar o Sistema de Cozinha da ETEC Bento Quirino.</p>

      <div className="login-switch">
        <label htmlFor="tipo-login">Entrar como</label>
        <select id="tipo-login" value={tipo} onChange={(event) => { setTipo(event.target.value); setMensagemPagina(''); }} disabled={carregando}>
          <option value="aluno">Aluno</option>
          <option value="cozinha">Cozinha</option>
        </select>
      </div>

      {mensagemPagina && <p className="auth-page-message" role="status">{mensagemPagina}</p>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group-container">
          {tipo === 'aluno' ? (
            <div className="form-field">
              <label htmlFor="RM">RM</label>
              <input id="RM" name="RM" type="text" inputMode="numeric" pattern="[0-9]+" className="form-input" value={RM} onChange={(event) => setRM(event.target.value.replace(/\D/g, ''))} required disabled={carregando} autoComplete="username" />
            </div>
          ) : (
            <div className="form-field">
              <label htmlFor="email">E-mail</label>
              <input id="email" name="email" type="email" className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={carregando} autoComplete="username" />
            </div>
          )}

          <div className="form-field">
            <label htmlFor="senha">Senha</label>
            <CampoSenha key={tipo} id="senha" value={senha} onChange={(event) => setSenha(event.target.value)} disabled={carregando} />
            {erro && <p className="campo-erro" role="alert">{erro}</p>}
            {bloqueado && <p className="campo-erro campo-erro-destaque" role="alert">{bloqueado}</p>}
          </div>
        </div>

        <button type="submit" className="form-submit" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      {tipo === 'aluno' && <Link to="/esqueci-senha" className="auth-link">Esqueci minha senha</Link>}
      <p className="auth-note">Por segurança, após 5 tentativas de senha incorreta, o acesso fica temporariamente bloqueado por 15 minutos.</p>
    </main>
  );
}
