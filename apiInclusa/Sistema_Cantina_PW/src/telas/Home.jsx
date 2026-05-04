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