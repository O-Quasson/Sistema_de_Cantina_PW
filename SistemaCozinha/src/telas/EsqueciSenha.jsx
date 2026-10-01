import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axios/api.js';
import '../estilos/auth.css';

export default function EsqueciSenhaScreen() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviar = async (event) => {
    event.preventDefault();
    setMensagem('');
    setErro('');
    setCarregando(true);
    try {
      const resposta = await api.post('/api/v1/autenticacao/esqueci-senha', { email });
      setMensagem(resposta.data.mensagem);
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível processar a recuperação.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="auth-page">
      <h1 className="auth-title">Esqueci minha senha</h1>
      <p className="auth-subtitle">Informe o e-mail cadastrado para receber as instruções de recuperação.</p>
      <form onSubmit={enviar} className="auth-form">
        <div className="form-field">
          <label htmlFor="email">E-mail cadastrado</label>
          <input id="email" type="email" className="form-input" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={carregando} autoComplete="email" />
        </div>
        <button className="form-submit" type="submit" disabled={carregando}>{carregando ? 'Enviando...' : 'Enviar instruções'}</button>
        {mensagem && <p className="campo-sucesso" role="status">{mensagem}</p>}
        {erro && <p className="campo-erro" role="alert">{erro}</p>}
      </form>
      <Link to="/login" className="auth-link">Voltar para o login</Link>
    </main>
  );
}
