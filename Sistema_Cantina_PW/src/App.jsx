import { useState, useEffect } from 'react'
import logo from './assets/logo.png'
import imagens from './assets/imagens.png'
import './App.css'
import { Helmet } from 'react-helmet';


// const windowHeight = window.innerHeight;

function App() {

  const [windowWidth, setWidth] = useState(screen.width)

  useEffect(() => {
    setWidth(screen.width);
  })

  return (
    <>
      <header style={{backgroundColor: '#110E41', height: windowWidth*0.105, minHeight: 75, justifyContent: 'center', gap: windowWidth*0.5, alignItems: 'center', display: 'flex', width: windowWidth, padding: windowWidth*0.02, boxSizing: 'border-box'}}>
        <img src={logo} style={{width: windowWidth*0.14, minWidth: 100}}/>
        <div style={{gap: windowWidth*0.08, display: 'flex'}}>
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
            <button style={{backgroundColor: "#6B0707", width: windowWidth*0.1, minWidth: '4rem',  height: windowWidth*0.04, minHeight: '1.5rem', color: 'white', fontSize: windowWidth*0.015, borderRadius: 7, boxShadow: 'none', outline: 'none', border: 'none'}}>Entrar</button>
          </a>
          
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
            <button style={{backgroundColor: "#6B0707", width: windowWidth*0.1, minWidth: '4rem', height: windowWidth*0.04, minHeight: '1.5rem', color: 'white', fontSize: windowWidth*0.015, borderRadius: 7, boxShadow: 'none', outline: 'none', border: 'none'}}>Cadastrar</button>
          </a> 
        </div>
      </header>

      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: windowWidth*0.05, width: windowWidth, flexDirection: 'column', boxSizing: 'border-box'}}>
        
        <div style={{marginBottom: windowWidth*0.06}}>
          <h1 style={{fontFamily: 'Dancing Script', fontSize: windowWidth*0.06, color: '#6B0707', textShadow: '-1px -1px 0 #000'}}> Bem Vindo</h1>
          <p style={{fontFamily: 'sans-serif', fontSize: windowWidth*0.015}}>Este site visa reduzir o desperdício de alimentos por parte dos alunos da Escola Etec Bento Quirino, afim de ter melhor utilização dos alimentos preparados</p>
        </div>

        <div> 
          <img src={imagens} style={{width: windowWidth*0.5}}></img>
        </div>

      </div>
    </>
  )
}

export default App
