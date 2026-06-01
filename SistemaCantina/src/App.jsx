import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import Loginscreen from './telas/Login.jsx';
import Homescreen from './telas/Home.jsx';
import Cadastroscreen from './telas/Cadastro.jsx';
import TesteAPI from './telas/teste.jsx';
import MenuScreen from './telas/MenuScreen.jsx';
import { isDesktop } from 'react-device-detect';
import logo from './assets/logo.png';

function Heder() {
  if (isDesktop === true) {
    return (
      <header style={styles.headerDesktop}>
        <Link to='/' style={styles.logoLink}>
          <img src={logo} style={styles.logoImagemDesktop} alt="Logo" />
        </Link>
        
        <div style={styles.botoesContainer}>
          <Link to='/login' style={styles.botaoLink}>
            <button style={styles.botaoPrincipal}>Entrar</button>
          </Link>
          
          <Link to='/cadastro' style={styles.botaoLink}>
            <button style={styles.botaoPrincipal}>Cadastrar</button>
          </Link>
        </div>
      </header>
    );
  } else {
    return (
      <header style={styles.headerMobile}>
        <Link to='/' style={styles.logoLink}>
          <img src={logo} style={styles.logoImagemMobile} alt="Logo" />
        </Link>
        
        <div style={styles.botoesContainerMobile}>
          <Link to="/login" style={styles.botaoLink}>
            <button style={styles.botaoMobile}>Entrar</button>
          </Link>
          
          <Link to='/cadastro' style={styles.botaoLink}>
            <button style={styles.botaoMobile}>Cadastrar</button>
          </Link> 
        </div>
      </header>
    );
  }
}

function App() {
  return (
    <BrowserRouter>
      <Heder />
      <Routes>
        <Route exact path='/' element={<Homescreen />} />
        <Route path='/login' element={<Loginscreen />} />
        <Route path='/cadastro' element={<Cadastroscreen />} />
        <Route path='/teste' element={<TesteAPI />} />
        <Route path='/menuscreen' element={<MenuScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

const styles = {
  logoLink: {
    display: 'flex',
    alignItems: 'center',
  },
  botaoLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  },

  // --- VERSÃO DESKTOP ---
  headerDesktop: {
    backgroundColor: '#1a1a2e',
    height: '5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0rem 5% 0rem 5%', 
  },
  logoImagemDesktop: {
    height: '4rem',
    objectFit: 'contain',
  },
  botoesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
  },
  botaoPrincipal: {
    background: 'linear-gradient(180deg, #681010, #3b0d0d)',
    padding: '0 1.5rem',
    height: '2.8rem',
    color: 'white',
    fontSize: '120%',
    borderRadius: 10,
    boxShadow: 'none',
    outline: 'none',
    border: 'none',
    cursor: 'pointer',
  },

  // --- VERSÃO MOBILE ---
  headerMobile: {
    backgroundColor: '#110E41',
    height: '4rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box',
    margin: 0,
    marginBottom: '15%',
    padding: '0rem 4% 0rem 4%', 
  },
  logoImagemMobile: {
    height: '2rem',
    objectFit: 'contain',
  },
  botoesContainerMobile: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
  },
  botaoMobile: {
    background: 'linear-gradient(180deg, #681010, #3b0d0d)',
    color: 'white',
    boxShadow: 'none',
    outline: 'none',
    border: 'none',
    fontSize: '100%',
    borderRadius: 7,
    padding: '0.5rem 1rem',
    cursor: 'pointer',
  },
};
