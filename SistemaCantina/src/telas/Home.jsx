import { useState, useEffect } from 'react'
import logo from '../assets/logo.png'
import imagens from '../assets/imagens.png'
import './Css.css'
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

function Homescreen() {
  const [windowWidth, setWidth] = useState(screen.width)

  useEffect(() => {
    setWidth('100%');
  }, [])

  return (
    <>
      <div className="home-container">
        <div className="home-text-section">
          <h1 className="home-title">Bem Vindo</h1>
          <p className="home-text">
            Este site visa reduzir o desperdício de alimentos por parte dos alunos da Escola Etec Bento Quirino, afim de ter melhor utilização dos alimentos preparados.
          </p>
        </div>
        <img src={imagens} className="home-image" alt="Imagens ilustrativas" />
      </div>

      <style>{`
        /* --- ESTILO PADRÃO (CELULAR/MOBILE FIRST) --- */
        .home-container {
          justify-content: center;
          align-items: center;
          padding: 10%;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          transform: translateY(-60px);

        }

        .home-text-section {
          width: 100%;
        }

        .home-title {
          font-family: 'Dancing Script', cursive;
          color: #6B0707;
          text-shadow: -1px -1px 0 #000;
          font-size: 350%;
          margin: 0;
        }

        .home-text {
          font-size: 120%;
          font-family: sans-serif;
          text-align: justify;
        }

        .home-image {
          width: 100%;
          margin-top: 10%;
        }

        /* --- MEDIA QUERIES --- */
        
        /* TABLET (600px a 768px) */
        @media (min-width: 600px) and (max-width: 768px) {
          .home-container {
            padding-top: 0px;
            transform: translateY(-70px);
            max-width: 750px;
            margin: 0 auto;
          }

          .home-title {
            font-size: 400%;
          }

          .home-text {
            font-size: 125%;
          }

          .home-image {
            width: 80%;
            margin-top: 5%;
          }
        }

        /* COMPUTADOR / DESKTOP (a partir de 769px) */
        @media (min-width: 769px) {
          .home-container {
            flex-direction: row; /* Coloca o texto ao lado da imagem */
            padding-top: 165px;
            max-width: 1250px;
            margin: 0 auto;
            gap: 3vw;
          }

          .home-text-section {
            margin-bottom: 0;
            text-align: initial;
            flex: 1;
          }

          .home-title {
            font-size: 500%;
          }

          .home-text {
            font-size: 130%;
          }

          .home-image {
            width: 35%;
            margin-top: 0;
          }
        }
      `}</style>
    </>
  )
}

export default Homescreen;