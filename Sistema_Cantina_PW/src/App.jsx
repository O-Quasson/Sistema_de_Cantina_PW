import React from 'react';
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Loginscreen from './telas/Login.jsx';
import Homescreen from './telas/Home.jsx';
import Cadastroscreen from './telas/Cadastro.jsx';


// const windowHeight = window.innerHeight;

function App() {
  return(
    <>
    <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<Homescreen />} />
      <Route path='/login' element={<Loginscreen />}/>
      <Route path='/cadastro' element={<Cadastroscreen />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
