import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MenuScreen() {
  const [cardapioOpen, setCardapioOpen] = useState(false)
  const [graficoOpen, setGraficoOpen] = useState(false)
  const navigate = useNavigate()

  // =============================================
  // 🎨 PERSONALIZE AQUI
  // =============================================

  const TEXTOS = {
    cardapioTitulo: 'Cardápios',          // título do card
    cardapioDescricao: 'Aqui você pode consultar os cardápios semanais do restaurante da Etec Bento Quirino, com todas as refeições preparadas pelos alunos do curso técnico de gastronomia.',

    graficoTitulo: 'Gráfico',             // título do card
    graficoDescricao: 'Acompanhe os gráficos de desperdício alimentar e consumo ao longo do tempo, ajudando a escola a reduzir o impacto ambiental e melhorar o aproveitamento dos alimentos preparados.',

    nomeEscola: 'Bento Quirino',          // rodapé
    subtituloEscola: 'ESCOLA TÉCNICA ESTADUAL',
  }

  const IMAGEM_COZINHA = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80'
  // ^ troque pela URL de qualquer imagem online que quiser

  const LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Camponotus_flavomarginatus_ant.jpg/640px-Camponotus_flavomarginatus_ant.jpg'
  // ^ troque pela URL do logo da escola (ou use: import logo from '../assets/logo.png')

  const ROTA_SAIR = '/'
  // ^ rota para onde o botão Sair navega

  const CORES = {
    tituloCards: '#6B0707',      // cor do texto Cardápios / Gráfico
    fundoPagina: '#f5f5f5',      // cor de fundo geral
    rodapeTexto: '#1a1a2e',      // cor do nome da escola no rodapé
  }

  // =============================================

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

        .container {
          min-height: 100vh;
          background-color: ${CORES.fundoPagina};
          font-family: sans-serif;
        }
        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .menu-card {
          background-color: white;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          overflow: hidden;
        }
        .menu-card-header {
          padding: 14px 20px;
        }
        .menu-title {
          font-family: 'Dancing Script', cursive;
          font-size: 32px;
          color: ${CORES.tituloCards};
          text-shadow: -1px -1px 0 rgba(0,0,0,0.2);
          margin: 0;
        }
        .expand-content {
          padding: 0 20px;
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
        }
        .expand-content.open {
          padding: 10px 20px 14px;
          max-height: 120px;
          opacity: 1;
        }
        .expand-text {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          margin: 0;
        }
        .kitchen-img {
          width: 100%;
          border-radius: 12px;
          object-fit: cover;
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
          color: ${CORES.rodapeTexto};
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

      <div className="container">
        <div className="content">

          <div className="menu-card" onClick={() => setCardapioOpen(!cardapioOpen)}>
            <div className="menu-card-header">
              <h2 className="menu-title">{TEXTOS.cardapioTitulo}</h2>
            </div>
            <div className={`expand-content ${cardapioOpen ? 'open' : ''}`}>
              <p className="expand-text">{TEXTOS.cardapioDescricao}</p>
            </div>
          </div>

          <div className="menu-card" onClick={() => setGraficoOpen(!graficoOpen)}>
            <div className="menu-card-header">
              <h2 className="menu-title">{TEXTOS.graficoTitulo}</h2>
            </div>
            <div className={`expand-content ${graficoOpen ? 'open' : ''}`}>
              <p className="expand-text">{TEXTOS.graficoDescricao}</p>
            </div>
          </div>

          <img src={IMAGEM_COZINHA} alt="Cozinha profissional" className="kitchen-img" />

          <div className="footer-logo">
            <img src={LOGO_URL} alt="Logo" className="footer-logo-img" />
            <div className="footer-logo-text">{TEXTOS.nomeEscola}</div>
            <hr className="footer-divider" />
            <div className="footer-logo-sub">{TEXTOS.subtituloEscola}</div>
          </div>

        </div>
      </div>
    </>
  )
}

export default MenuScreen
