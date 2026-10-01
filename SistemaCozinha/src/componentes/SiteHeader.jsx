import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext.jsx';

function IconeUsuario() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.9-3.4 3.3-5.2 7-5.2s6.1 1.8 7 5.2" />
    </svg>
  );
}

function IconeSair() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10" />
      <path d="M14 8l4 4-4 4" />
      <path d="M9 12h9" />
    </svg>
  );
}

export default function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setMenuAberto(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuAberto) return undefined;
    const fechar = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuAberto(false);
    };
    document.addEventListener('mousedown', fechar);
    return () => document.removeEventListener('mousedown', fechar);
  }, [menuAberto]);

  const handleSair = async () => {
    await sair();
    navigate('/');
  };

  const destinoLogo = usuario?.tipoUsuario === 'COZINHA'
    ? '/telainicialcozinha'
    : usuario?.tipoUsuario === 'ALUNO'
      ? '/telainicialaluno'
      : '/';

  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to={destinoLogo} className="logo-link" aria-label="Ir para o início">
          <img src={logo} className="logo-imagem" alt="ETEC Bento Quirino" />
        </Link>

        {!usuario ? (
          <nav className="header-nav" aria-label="Navegação principal">
            <Link to="/login" className="header-button header-button-secondary">Entrar</Link>
            <Link to="/cadastro" className="header-button header-button-primary">Cadastrar</Link>
          </nav>
        ) : (
          <div className="header-user" ref={menuRef}>
            <button
              type="button"
              className="user-menu-trigger"
              onClick={() => setMenuAberto((aberto) => !aberto)}
              aria-expanded={menuAberto}
              aria-haspopup="menu"
              aria-label="Abrir menu da conta"
            >
              <span className="user-avatar"><IconeUsuario /></span>
              <span className="user-name">
                {usuario.tipoUsuario === 'COZINHA' ? 'Cozinha' : (usuario.nome?.split(' ')[0] || 'Aluno')}
              </span>
              <span className={`user-chevron ${menuAberto ? 'open' : ''}`} aria-hidden="true">⌄</span>
            </button>

            {menuAberto && (
              <div className="user-menu" role="menu">
                {usuario.tipoUsuario === 'ALUNO' && (
                  <Link to="/telaperfilaluno" className="user-menu-item" role="menuitem">
                    Perfil
                  </Link>
                )}
                <button type="button" className="user-menu-item user-menu-logout" onClick={handleSair} role="menuitem">
                  <span>Sair</span>
                  <IconeSair />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
