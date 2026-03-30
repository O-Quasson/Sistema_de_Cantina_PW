import { useState } from 'react'
import logo from './assets/logo.png'
import './App.css'

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

function App() {

  return (
    <>
      <header style={{backgroundColor: '#110E41', height: windowWidth*0.10, justifyContent: 'center', alignItems: 'center' ,display: 'flex', gap: windowWidth*0.5, width: windowWidth, padding: windowWidth*0.02}}>
        <img src={logo} style={{width: windowWidth*0.14}}/>
        <div style={{gap: windowWidth*0.08, display: 'flex'}}>
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
            <button style={{backgroundColor: "#6B0707", width: windowWidth*0.1, height: windowWidth*0.04, color: 'white', fontSize: windowWidth*0.015, borderRadius: 7, boxShadow: 'none', outline: 'none'}}>Entrar</button>
          </a>
          
          <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
            <button style={{backgroundColor: "#6B0707", width: windowWidth*0.1, height: windowWidth*0.04, color: 'white', fontSize: windowWidth*0.015, borderRadius: 7, boxShadow: 'none', outline: 'none'}}>Cadastrar</button>
          </a> 
        </div>
      </header>
    </>
  )
}

export default App
