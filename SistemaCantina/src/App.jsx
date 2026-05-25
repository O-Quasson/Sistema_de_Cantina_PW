import React from 'react';
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

import Loginscreen from './telas/Login.jsx';
import Homescreen from './telas/Home.jsx';
import Cadastroscreen from './telas/Cadastro.jsx';
import TesteAPI from './telas/teste.jsx';
import MenuScreen from './telas/MenuScreen.jsx';
import { isDesktop } from 'react-device-detect';
import logo from './assets/logo.png'
import imagens from './assets/imagens.png'



// const windowHeight = window.innerHeight;

function Heder() {
  if(isDesktop==true){
    return(
      <>
        <header style={{backgroundColor: '#1a1a2e', height: '4.5rem', justifyContent: 'space-between', alignItems: 'center', display: 'flex', width: "100%", padding: '3% 5% 3% 5%', boxSizing: 'border-box'}}>
          <Link to='/'>
              <img src={logo} style={{width: '11%'}}/>
          </Link>
          
          <div style={{gap: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Link to='/login'>
              <button style={{backgroundColor: "#6B0707", width: '175%',  height: '3rem', color: 'white', fontSize: "120%", borderRadius: 7, boxShadow: 'none', outline: 'none', border: 'none', cursor: 'pointer'}}>Entrar</button>
            </Link>
            
            <Link to='/cadastro'>
              <button style={{backgroundColor: "#6B0707", width: '120%', height: "3rem",  color: 'white', fontSize: '120%', borderRadius: 7, boxShadow: 'none', outline: 'none', border: 'none', cursor: 'pointer'}}>Cadastrar</button>
            </Link>
          </div>
        </header>
      </>
    )
  }else{
    return(
      <>
        <header style={{backgroundColor: '#110E41', height: '4rem', justifyContent: 'space-between', alignItems: 'center', display: 'flex', width: window.innerWidth, padding: '2%', boxSizing: 'border-box', margin: 0, marginBottom: '15%', objectFit: 'contain'}}>
          <Link to='/' style={{width: '20%'}}>
            <img src={logo} style={{width: '100%', flexShrink: 0}}/>
          </Link>
          
          <div style={{gap: '1rem', display: 'flex', alignItems: 'center'}}>
            <Link to="/login">
              <button style={{backgroundColor: "#6B0707", color: 'white', boxShadow: 'none', outline: 'none', border: 'none', fontSize: '100%', borderRadius: 7, padding: '0.5rem' }}>Entrar</button>
            </Link>
            
            <Link to='/cadastro'>
              <button style={{backgroundColor: "#6B0707", color: 'white', boxShadow: 'none', outline: 'none', border: 'none', fontSize: '100%', borderRadius: 7, padding: '0.5rem'}}>Cadastrar</button>
            </Link> 
          </div>
        </header>
      </>
    )
  }
}

function App() {
  return(
    <>
    <BrowserRouter>
    <Heder></Heder>
    <Routes>
      <Route exact path='/' element={<Homescreen />} />
      <Route path='/login' element={<Loginscreen />}/>
      <Route path='/cadastro' element={<Cadastroscreen />}/>
      <Route path='/teste' element={<TesteAPI />} />
      <Route path='/menuscreen' element={<MenuScreen/>} />

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
