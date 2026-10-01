import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../axios/api.js';
import CampoSenha from '../componentes/CampoSenha.jsx';
import '../estilos/auth.css';

export default function RedefinirSenhaScreen() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const enviar = async (event) => {
    event.preventDefault();
    setErro('');
    setSucesso('');
    if (!token) return setErro('Link de recuperação inválido.');
    if (senha.length < 8) return setErro('A senha deve ter pelo menos 8 caracteres.');
    if (senha !== confirmacao) return setErro('As senhas devem ser iguais.');
    setCarregando(true);
    try {
      await api.post('/api/v1/autenticacao/redefinir-senha', { token, senha });
      setSucesso('Senha redefinida com sucesso. Você será levado ao login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível redefinir a senha.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="auth-page">
      <h1 className="auth-title">Nova senha</h1>
      <p className="auth-subtitle">Escolha uma nova senha para sua conta de aluno.</p>
      <form onSubmit={enviar} className="auth-form">
        <div className="form-group-container">
          <div className="form-field">
            <label htmlFor="senha">Nova senha</label>
            <CampoSenha id="senha" value={senha} onChange={(event) => setSenha(event.target.value)} disabled={carregando} autoComplete="new-password" minLength={8} maxLength={128} />
          </div>
          <div className="form-field">
            <label htmlFor="confirmacao">Confirmar nova senha</label>
            <CampoSenha id="confirmacao" value={confirmacao} onChange={(event) => setConfirmacao(event.target.value)} disabled={carregando} autoComplete="new-password" minLength={8} maxLength={128} />
          </div>
        </div>
        <button className="form-submit" type="submit" disabled={carregando}>{carregando ? 'Salvando...' : 'Redefinir senha'}</button>
        {erro && <p className="campo-erro" role="alert">{erro}</p>}
        {sucesso && <p className="campo-sucesso" role="status">{sucesso}</p>}
      </form>
      <Link to="/login" className="auth-link">Voltar para o login</Link>
    </main>
  );
}
