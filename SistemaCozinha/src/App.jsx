import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Homescreen from './telas/Home.jsx';
import Loginscreen from './telas/Login.jsx';
import Cadastroscreen from './telas/Cadastro.jsx';
import EsqueciSenhaScreen from './telas/EsqueciSenha.jsx';
import RedefinirSenhaScreen from './telas/RedefinirSenha.jsx';
import TelaInicialCozinha from './telas/ParteCozinha/TelaInicialCozinha.jsx';
import TelaInicialAluno from './telas/ParteAluno/TelaInicialAluno.jsx';
import TelaPerfilAluno from './telas/ParteAluno/TelaPerfilAluno.jsx';
import SiteHeader from './componentes/SiteHeader.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import './estilos/app.css';

function RotaProtegida({ children, cozinha = false }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <div className="app-loading">Carregando...</div>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (cozinha && usuario.tipoUsuario !== 'COZINHA') return <Navigate to="/telainicialaluno" replace />;
  if (!cozinha && usuario.tipoUsuario !== 'ALUNO') return <Navigate to="/telainicialcozinha" replace />;
  return children;
}

function RotaPublica({ children }) {
  const { usuario, carregando } = useAuth();
  if (carregando) return <div className="app-loading">Carregando...</div>;
  if (!usuario) return children;
  return <Navigate to={usuario.tipoUsuario === 'COZINHA' ? '/telainicialcozinha' : '/telainicialaluno'} replace />;
}

function Rotas() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Homescreen />} />
        <Route path="/login" element={<RotaPublica><Loginscreen /></RotaPublica>} />
        <Route path="/cadastro" element={<RotaPublica><Cadastroscreen /></RotaPublica>} />
        <Route path="/esqueci-senha" element={<RotaPublica><EsqueciSenhaScreen /></RotaPublica>} />
        <Route path="/redefinir-senha" element={<RedefinirSenhaScreen />} />
        <Route path="/telainicialcozinha" element={<RotaProtegida cozinha><TelaInicialCozinha /></RotaProtegida>} />
        <Route path="/telainicialaluno" element={<RotaProtegida><TelaInicialAluno /></RotaProtegida>} />
        <Route path="/telaperfilaluno" element={<RotaProtegida><TelaPerfilAluno /></RotaProtegida>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Rotas />
      </AuthProvider>
    </BrowserRouter>
  );
}
