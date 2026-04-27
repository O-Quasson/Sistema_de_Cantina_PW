import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import imagens from '../assets/imagens.png'
import './Css.css'
import { Helmet } from 'react-helmet';
import { isMobile, isDesktop } from 'react-device-detect';
import { Link } from 'react-router-dom';



// const windowHeight = window.innerHeight;

function Homescreen() {

  const [windowWidth, setWidth] = useState(screen.width)

  useEffect(() => {
    setWidth('100%');
  }, [])

  if(isDesktop==true){
    return(
      <>
        <header style={{backgroundColor: '#110E41', height: '4.5rem', justifyContent: 'space-between', alignItems: 'center', display: 'flex', width: "100%", padding: '3% 5% 3% 5%', boxSizing: 'border-box'}}>
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
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: windowWidth*0.05, width: '100%', boxSizing: 'border-box', gap: windowWidth*0.05}}>
          
          <div style={{marginBottom: windowWidth*0.06, textAlign: 'initial'}}>
            <h1 style={{fontFamily: 'Dancing Script', fontSize: '500%', color: '#6B0707', textShadow: '-1px -1px 0 #000'}}> Bem Vindo</h1>
            <p style={{fontFamily: 'sans-serif', fontSize: '130%', textAlign: 'justify'}}>Este site visa reduzir o desperdício de alimentos por parte dos alunos da Escola Etec Bento Quirino, afim de ter melhor utilização dos alimentos preparados</p>
          </div>
  
          <img src={imagens} style={{width: '35%'}}></img>

        </div>
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
        <div style={{justifyContent: 'center', alignItems: 'center', padding: '10%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'}}>
          <div>
            <h1 style={{fontFamily: 'Dancing Script', color: '#6B0707', textShadow: '-1px -1px 0 #000', fontSize: '350%', margin: '0 0 0 0'}}>Bem Vindo</h1>
            <p style={{fontSize: '120%', fontFamily: 'sans-serif', textAlign: 'justify'}}>Este site visa reduzir o desperdício de alimentos por parte dos alunos da Escola Etec Bento Quirino, afim de ter melhor utilização dos alimentos preparados </p>
          </div>
          <img src={imagens} style={{width: '100%', marginTop: '10%'}}/>
        </div>
      </>
    )
    
  }
}

export default Homescreen;