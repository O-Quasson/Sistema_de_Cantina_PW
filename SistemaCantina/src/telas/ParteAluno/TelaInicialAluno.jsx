import { useState } from 'react'
import livroslogo from '../../assets/livroslogo.png'
import pratoExemplo from '../../assets/prato.png'
import calendario from '../../assets/calendario.png'

function TelaInicialAluno() {
  const [ireiComer, setIreiComer] = useState(false)
  const [quantidadeSelecionada, setQuantidadeSelecionada] = useState('')
  const [selectedDate, setSelectedDate] = useState('25/05')

  const dates = ['25/05', '26/05', '27/05', '28/05', '29/05', '30/05']
  const opcoesQuantidade = ['200g', '400g', '600g', '800g']

  const handleEnviar = () => {
    // Lógica para envio dos dados
  }

  return (
    <>
      <div className="container">
        <div className="content">
          <h2 className="welcome-text">Olá, Jair Messias Bolsonaro</h2>

          {/* --- SELETOR DE DIAS DO CARDÁPIO --- */}
          <div className="calendar-selector">
            <div className="dates-grid">
              {dates.map((date) => (
                <span
                  key={date}
                  className={`date-item ${selectedDate === date ? 'active' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  {date}
                </span>
              ))}
            </div>
            <img src={calendario} className="calendar-icon-img" alt="Calendário" />
          </div>

          {/* Card do Cardápio do dia */}
          <div className="card-aluno">
            <h3 className="card-title">Cardápio ({selectedDate}/2026)</h3>
            
            <div className="food-image-container">
              <img src={pratoExemplo} alt="Prato do dia" className="food-image" />
            </div>

            <p className="ingredients-link">Clique aqui para saber os ingredientes</p>
          </div>

          {/* Card "Irei comer hoje" */}
          <div className="card-aluno">
            <div className="toggle-row">
              <span className="card-title">Irei comer hoje</span>
              
              <label className="switch">
                <input
                  type="checkbox"
                  checked={ireiComer}
                  onChange={(e) => {
                    setIreiComer(e.target.checked)
                    if (!e.target.checked) setQuantidadeSelecionada('')
                  }}
                />
                <span className="slider round"></span>
              </label>
            </div>

            {/* Exibe opções de quantidade ao ativar o interruptor */}
            {ireiComer && (
              <div className="quantidade-section">
                <h4 className="quantidade-title">Quantidade</h4>
                <div className="options-list">
                  {opcoesQuantidade.map((qtd) => (
                    <button
                      key={qtd}
                      type="button"
                      className={`option-btn ${
                        quantidadeSelecionada === qtd ? 'selected' : ''
                      }`}
                      onClick={() => setQuantidadeSelecionada(qtd)}
                    >
                      {qtd}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button 
              className="btn-enviar"
              onClick={handleEnviar}
            >
              Enviar
            </button>
          </div>

          {/* Rodapé */}
          <div className="footer-logo">
            <img src={livroslogo} alt="Logo" className="footer-logo-img" />
            <div className="footer-logo-text">Bento Quirino</div>
            <hr className="footer-divider" />
            <div className="footer-logo-sub">ESCOLA TÉCNICA ESTADUAL</div>
          </div>

        </div>
      </div>

      <style>{`
        /* Oculta barras de rolagem */
        html::-webkit-scrollbar, 
        body::-webkit-scrollbar,
        .container::-webkit-scrollbar {
          display: none;
        }

        html, body, .container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        html, body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          background-color: #ffffff;
          font-family: sans-serif;
        }

        .container {
          min-height: 100vh;
          width: 100%;
          background-color: #ffffff;
          box-sizing: border-box;
        }

        /* BASE CELULAR */
        .content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          box-sizing: border-box;
          max-width: 480px;
          margin: 0 auto;
        }

        .welcome-text {
          font-size: 22px;
          font-weight: bold;
          color: #000000;
          margin: 8px 0 4px 0;
        }

        /* --- ESTILOS DO SELETOR DE DIA (ALINHAMENTO PERFEITO COM BORDA) --- */
        .calendar-selector {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #f3f3f3;
          padding: 10px 12px;
          border-radius: 12px;
        }

        .dates-grid {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .date-item {
          flex: 1;
          font-size: 13px;
          font-weight: bold;
          color: #3b0d0d;
          cursor: pointer;
          text-align: center;
          /* Cria a barra vertical exata entre os itens */
          border-right: 1px solid #6d1f1f;
          padding: 0 4px;
        }

        /* Remove a barra vertical do último item (30/05) */
        .date-item:last-child {
          border-right: none;
        }

        .date-item.active {
          color: #6d1f1f;
          text-decoration: underline;
        }

        .calendar-icon-img {
          width: 22px;
          height: 22px;
          object-fit: contain;
          margin-left: 10px;
        }

        /* --- CARDS DA PÁGINA --- */
        .card-aluno {
          background-color: #f3f3f3;
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
        }

        .card-title {
          font-size: 18px;
          font-weight: bold;
          color: #000000;
          margin: 0 0 12px 0;
        }

        .food-image-container {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 12px;
        }

        .food-image {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        .ingredients-link {
          font-size: 13px;
          font-weight: bold;
          color: #000000;
          margin: 0;
          cursor: pointer;
        }

        /* --- TOGGLE ROW --- */
        .toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* SWITCH TOGGLE */
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ffffff;
          border: 2px solid #333333;
          transition: .3s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 2px;
          bottom: 2px;
          background-color: #333333;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #333333;
        }

        input:checked + .slider:before {
          background-color: #ffffff;
          transform: translateX(22px);
        }

        /* --- SEÇÃO DE QUANTIDADE --- */
        .quantidade-section {
          margin-top: 16px;
        }

        .quantidade-title {
          font-size: 16px;
          font-weight: bold;
          color: #000000;
          margin: 0 0 12px 0;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 16px;
        }

        .option-btn {
          width: 100%;
          background-color: #dcdcdc;
          border: none;
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 16px;
          font-weight: bold;
          text-align: left;
          color: #000000;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s;
        }

        /* COR DA OPÇÃO SELECIONADA */
        .option-btn.selected {
          background-color: #0b0833;
          color: #ffffff;
        }

        /* BOTÃO ENVIAR */
        .btn-enviar {
          width: 100%;
          background-color: #0b0833;
          color: #ffffff;
          border: none;
          border-radius: 20px;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 8px;
        }

        /* RODAPÉ DO CÓDIGO BASE */
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

        /* MEDIA QUERIES (Estrutura responsiva adaptada) */
        @media (min-width: 600px) and (max-width: 768px) {
          .content {
            padding-top: 0px;
            transform: translateY(-60px);
            max-width: 700px;
          }
        }

        @media (min-width: 769px) {
          .content {
            padding-top: 65px;
            max-width: 850px;
          }
        }
      `}</style>
    </>
  )
}

export default TelaInicialAluno