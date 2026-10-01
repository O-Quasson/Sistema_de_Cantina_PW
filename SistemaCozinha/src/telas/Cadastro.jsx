import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../axios/api.js';
import CampoSenha from '../componentes/CampoSenha.jsx';
import '../estilos/auth.css';

export default function Cadastroscreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ RM: '', nome: '', email: '', senha: '', confirmacao: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const alterar = (campo) => (event) => setForm((atual) => ({ ...atual, [campo]: event.target.value }));

  const enviar = async (event) => {
    event.preventDefault();
    setErro('');
    setSucesso('');

    if (!/^\d+$/.test(form.RM)) return setErro('Informe um RM válido.');
    if (form.nome.trim().length < 2) return setErro('Informe seu nome completo.');
    if (form.senha.length < 8) return setErro('A senha deve ter pelo menos 8 caracteres.');
    if (form.senha !== form.confirmacao) return setErro('As senhas devem ser iguais.');

    setCarregando(true);
    try {
      await api.post('/api/v1/autenticacao/aluno/cadastro', {
        RM: form.RM,
        nome: form.nome,
        email: form.email,
        senha: form.senha
      });
      setSucesso('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível concluir o cadastro.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <main className="auth-page">
      <h1 className="auth-title">Cadastrar</h1>
      <p className="auth-subtitle">Crie sua conta de aluno para registrar sua resposta do almoço.</p>

      <form onSubmit={enviar} className="auth-form">
        <div className="form-group-container">
          <div className="form-field">
            <label htmlFor="RM">RM</label>
            <input id="RM" name="RM" type="text" inputMode="numeric" pattern="[0-9]+" className="form-input" value={form.RM} onChange={(event) => setForm((atual) => ({ ...atual, RM: event.target.value.replace(/\D/g, '') }))} required disabled={carregando} autoComplete="username" />
          </div>

          <div className="form-field">
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" name="nome" type="text" className="form-input" value={form.nome} onChange={alterar('nome')} maxLength={120} required disabled={carregando} autoComplete="name" />
          </div>

          <div className="form-field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" className="form-input" value={form.email} onChange={alterar('email')} maxLength={254} required disabled={carregando} autoComplete="email" />
          </div>

          <div className="form-field">
            <label htmlFor="senha">Senha</label>
            <CampoSenha id="senha" name="senha" value={form.senha} onChange={alterar('senha')} disabled={carregando} autoComplete="new-password" minLength={8} maxLength={128} />
          </div>

          <div className="form-field">
            <label htmlFor="confirmacao">Confirmar senha</label>
            <CampoSenha id="confirmacao" name="confirmacao" value={form.confirmacao} onChange={alterar('confirmacao')} disabled={carregando} autoComplete="new-password" minLength={8} maxLength={128} />
          </div>
        </div>

        <button type="submit" className="form-submit" disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        {erro && <p className="campo-erro" role="alert">{erro}</p>}
        {sucesso && <p className="campo-sucesso" role="status">{sucesso}</p>}
      </form>

      <Link to="/login" className="auth-link">Já tenho uma conta</Link>
    </main>
  );
}
