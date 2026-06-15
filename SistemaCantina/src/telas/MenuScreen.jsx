import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import cozinheiros from '../assets/cozinheiros.png'
import logo from '../assets/logo.png'
import livroslogo from '../assets/livroslogo.png'

function MenuScreen() {
  const [cardapioOpen, setCardapioOpen] = useState(false)
  const [graficoOpen, setGraficoOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('25/05')
  const navigate = useNavigate()

  const dates = ['25/05', '26/05', '27/05', '28/05', '29/05', '30/05']

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

            <div 
              className={`expand-content ${cardapioOpen ? 'open' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Seletor de Datas da Semana */}
              <div className="calendar-selector">
                {dates.map((date, index) => (
                  <div key={date} className="date-item-wrapper">
                    <span
                      className={`date-item ${selectedDate === date ? 'active' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      {date}
                    </span>
                    {index < dates.length - 1 && <span className="divider">|</span>}
                  </div>
                ))}
                <span className="calendar-icon">📅</span>
              </div>

              {/* Detalhes do Dia Selecionado */}
              <div className="day-details">
                <h3 className="day-title">Segunda-feira <br /> {selectedDate}</h3>
                
                {/* Área de Adicionar Imagem */}
                <div className="image-placeholder">
                  <span className="plus-icon">+</span>
                  <span className="placeholder-text">Adicionar Imagem</span>
                </div>

                <p className="ingredients-text">Lista de ingredientes</p>

                <button className="btn-editar-interno">Editar</button>
              </div>
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
          background: #e6e6e6;          
          border: 1px solid #c1c1c1;
        }

        /* Gráfico */
        .grafico-card {
          background: #e6e6e6;
          border: 1px solid #c1c1c1;
        }

        .menu-card-header {
          padding: 14px 20px;
        }

        .menu-title {
          font-family: 'Dancing Script', cursive;
          font-size: 32px;
          color: #7f0b0b;
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
          max-height: 600px; /* Aumentado para comportar os novos elementos sem cortar */
          opacity: 1;
        }

        .expand-text {
          font-size: 14px;
          color: #f5f5f5;
          line-height: 1.6;
          margin: 0;
        }

        /* Elementos internos do menu expandido (usando suas cores base) */
        .calendar-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
          padding: 8px 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .date-item-wrapper {
          display: flex;
          align-items: center;
        }

        .date-item {
          font-size: 13px;
          font-weight: bold;
          color: #3b0d0d;
          cursor: pointer;
        }

        .date-item.active {
          color: #6d1f1f;
          text-decoration: underline;
        }

        .divider {
          color: #6d1f1f;
          margin-left: 6px;
          font-size: 12px;
        }

        .calendar-icon {
          font-size: 16px;
        }

        .day-details {
          display: flex;
          flex-direction: column;
          color: #000000;
        }

        .day-title {
          font-size: 18px;
          margin-bottom: 12px;
          font-weight: bold;
        }

        .image-placeholder {
          width: 100%;
          height: 160px;
          background-color: #6e6e6e;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          margin-bottom: 12px;
        }

        .plus-icon {
          color: #ffffff;
          font-size: 32px;
          font-weight: 300;
        }

        .placeholder-text {
          color: #ffffff;
          font-size: 12px;
        }

        .ingredients-text {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 16px;
        }

        .btn-editar-interno {
          background-color: #1a1a2e;
          color: #ffffff;
          border: none;
          padding: 8px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          align-self: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-editar-interno:hover {
          background-color: #f5f5f5;
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
