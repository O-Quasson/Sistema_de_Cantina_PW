import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cozinheiros from '../assets/cozinheiros.png'
import logo from '../assets/logo.png'
import livroslogo from '../assets/livroslogo.png'

function MenuScreen() {
  const [cardapioOpen, setCardapioOpen] = useState(false)
  const [graficoOpen, setGraficoOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <>
      <div className="container">
        <div className="content">

          {/* Card de Cardápios */}
          <div
            className="menu-card cardapio-card"
            onClick={() => setCardapioOpen(!cardapioOpen)}
          >
            <div className="menu-card-header">
              <h2 className="menu-title">Cardápios</h2>
            </div>

            <div className={`expand-content ${cardapioOpen ? 'open' : ''}`}>
              <p className="expand-text">
                Aqui você pode consultar os cardápios semanais do restaurante da
                Etec Bento Quirino, com todas as refeições preparadas pelos alunos
                do curso técnico de gastronomia.
              </p>
            </div>
          </div>

          {/* Card de Gráficos */}
          <div
            className="menu-card grafico-card"
            onClick={() => setGraficoOpen(!graficoOpen)}
          >
            <div className="menu-card-header">
              <h2 className="menu-title">Gráfico</h2>
            </div>

            <div className={`expand-content ${graficoOpen ? 'open' : ''}`}>
              <p className="expand-text">
                Acompanhe os gráficos de desperdício alimentar e consumo ao longo
                do tempo, ajudando a escola a reduzir o impacto ambiental e
                melhorar o aproveitamento dos alimentos preparados.
              </p>
            </div>
          </div>

          {/* Imagem Local da Cozinha */}
          <img
            src={cozinheiros}
            alt="Cozinha profissional"
            className="kitchen-img"
          />

          {/* Rodapé */}
          <div className="footer-logo">
            <img
              src={livroslogo}
              alt="Logo"
              className="footer-logo-img"
            />
            <div className="footer-logo-text">Bento Quirino</div>
            <hr className="footer-divider" />
            <div className="footer-logo-sub">
              ESCOLA TÉCNICA ESTADUAL
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

        .container {
          min-height: 100vh;
          background-color: #ffffff;
          font-family: sans-serif;
        }

        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .menu-card {
          border-radius: 12px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.2s ease;
        }

        .menu-card:hover {
          transform: translateY(-2px);
        }

        /* Cardápios */
        .cardapio-card {
          background: linear-gradient(180deg, #6d1f1f, #3b0d0d);          
          border: 1px solid #c1c1c1;
        }

        /* Gráfico */
        .grafico-card {
          background: linear-gradient(180deg, #6d1f1f, #3b0d0d);
          border: 1px solid #c1c1c1;
        }

        .menu-card-header {
          padding: 14px 20px;
        }

        .menu-title {
          font-family: 'Dancing Script', cursive;
          font-size: 32px;
          color: white;
          margin: 0;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
        }

        .expand-content {
          padding: 0 20px;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition:
            max-height 0.3s ease,
            opacity 0.3s ease,
            padding 0.3s ease;
        }

        .expand-content.open {
          padding: 10px 20px 14px;
          max-height: 150px;
          opacity: 1;
        }

        .expand-text {
          font-size: 14px;
          color: #f5f5f5;
          line-height: 1.6;
          margin: 0;
        }

        .kitchen-img {
          width: 100%;
          border-radius: 12px;
          object-fit: cover;
          margin-top: 8px;
        }

        .footer-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 0 16px;
          gap: 4px;
        }

        .footer-logo-img {
          width: 70px;
          margin-bottom: 4px;
        }

        .footer-logo-text {
          font-size: 22px;
          font-weight: 700;
          color: #1a1a2e;
        }

        .footer-divider {
          width: 120px;
          border: none;
          border-top: 1px solid #bbb;
          margin: 4px 0;
        }

        .footer-logo-sub {
          font-size: 11px;
          color: #888;
          letter-spacing: 1px;
        }
      `}</style>
    </>
  )
}

export default MenuScreen
