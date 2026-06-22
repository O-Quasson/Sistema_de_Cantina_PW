import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import Loginscreen from './telas/Login.jsx';
import Homescreen from './telas/Home.jsx';
import Cadastroscreen from './telas/Cadastro.jsx';
import TesteAPI from './telas/teste.jsx';
import MenuScreen from './telas/MenuScreen.jsx';
import logo from './assets/logo.png';

function Heder() {
  return (
    <>
      <header className="app-header">
        <Link to='/' className="logo-link">
          <img src={logo} className="logo-imagem" alt="Logo" />
        </Link>
        
        <div className="botoes-container">
          <Link to='/login' className="botao-link">
            <button className="botao-header">Entrar</button>
          </Link>
          
          <Link to='/cadastro' className="botao-link">
            <button className="botao-header">Cadastrar</button>
          </Link>
        </div>
      </header>

      <style>{`
        /* --- ESTILO PADRÃO (CELULAR/MOBILE) --- */
        .logo-link {
          display: flex;
          align-items: center;
        }
        .botao-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        .app-header {
          background-color: #110E41; /* Corrigido de backgroundColor para background-color */
          height: 4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
          margin: 0;
          margin-bottom: 15%;
          padding: 0rem 4%; 
        }
        .logo-imagem {
          height: 2rem;
          object-fit: contain;
        }
        .botoes-container {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .botao-header {
          background: linear-gradient(180deg, #681010, #3b0d0d);
          color: white;
          box-shadow: none;
          outline: none;
          border: none;
          font-size: 100%;
          border-radius: 7px;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }

        /* --- ESTILO PARA COMPUTADOR (MEDIA QUERY) --- */
        @media (min-width: 769px) {
          .app-header {
            background-color: #1a1a2e; /* Corrigido de backgroundColor para background-color */
            height: 5rem;
            margin-bottom: 0;
            padding: 0rem 5%; 
          }
          .logo-imagem {
            height: 4rem;
          }
          .botoes-container {
            justify-content: center;
            gap: 1rem;
          }
          .botao-header {
            padding: 0 1.5rem;
            height: 2.8rem;
            font-size: 120%;
            border-radius: 10px;
          }
        }
      `}</style>
    </>
  );
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
