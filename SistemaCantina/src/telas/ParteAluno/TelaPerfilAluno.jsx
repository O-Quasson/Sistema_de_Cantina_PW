import { useState } from 'react'

function TelaPerfilAluno() {
  // Estados do formulário de perfil
  const [rm, setRm] = useState('20240392')
  const [nome, setNome] = useState('Jair Messias Bolsonaro')
  const [senha, setSenha] = useState('**********')

  // Estado para controlar se a seção de predefinir almoço está aberta
  const [predefinirOpen, setPredefinirOpen] = useState(false)

  // Estados dos toggles de Predefinir Almoço
  const [diasSemana, setDiasSemana] = useState({
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
  })

  const handleToggleDia = (dia) => {
    setDiasSemana((prev) => ({
      ...prev,
      [dia]: !prev[dia],
    }))
  }

  const handleEditarPerfil = () => {
    // Lógica para editar perfil
  }

  const handleEnviarPreDefinicao = () => {
    // Lógica para salvar a pré-definição
  }

  return (
    <>
      <div className="container">
        <div className="content">
          
          {/* Título Principal */}
          <h1 className="title-script">Perfil</h1>

          {/* Card de Perfil do Usuário */}
          <div className="card-aluno card-profile">
            <button type="button" className="settings-btn" title="Configurações">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#7f7f7f">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </button>

            {/* Avatar com botão de editar foto */}
            <div className="avatar-wrapper">
              <div className="avatar-circle">
                <svg viewBox="0 0 24 24" fill="#a0a0a0" className="avatar-icon">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <button type="button" className="edit-avatar-btn">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </button>
            </div>

            {/* Form de Dados */}
            <div className="form-group">
              <label className="field-label">RM</label>
              <input
                type="text"
                className="input-field"
                value={rm}
                onChange={(e) => setRm(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="field-label">Nome</label>
              <input
                type="text"
                className="input-field"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="field-label">Senha</label>
              <input
                type="password"
                className="input-field"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <button type="button" className="btn-editar" onClick={handleEditarPerfil}>
              Editar
            </button>
          </div>

          {/* Único Card Unificado para Predefinir Almoço */}
          <div className="predefinir-card-wrapper">
            <div 
              className={`card-header-banner ${predefinirOpen ? 'expanded' : ''}`}
              onClick={() => setPredefinirOpen(!predefinirOpen)}
            >
              <h2 className="title-script inner-title">Predefinir Almoço</h2>
            </div>

            {/* Conteúdo dos dias dentro do mesmo bloco */}
            <div className={`expand-content ${predefinirOpen ? 'open' : ''}`}>
              <div className="dias-container">
                <div className="day-row">
                  <span className="day-label">Segunda- Feira</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={diasSemana.segunda}
                      onChange={() => handleToggleDia('segunda')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="day-row">
                  <span className="day-label">Terça- Feira</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={diasSemana.terca}
                      onChange={() => handleToggleDia('terca')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="day-row">
                  <span className="day-label">Quarta- Feira</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={diasSemana.quarta}
                      onChange={() => handleToggleDia('quarta')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="day-row">
                  <span className="day-label">Quinta- Feira</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={diasSemana.quinta}
                      onChange={() => handleToggleDia('quinta')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="day-row">
                  <span className="day-label">Sexta- Feira</span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={diasSemana.sexta}
                      onChange={() => handleToggleDia('sexta')}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <button
                  type="button"
                  className="btn-enviar-predefinicao"
                  onClick={handleEnviarPreDefinicao}
                >
                  Enviar Pré-Definição
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

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

        /* --- TÍTULOS --- */
        .title-script {
          font-family: 'Dancing Script', cursive;
          font-size: 42px;
          color: #630c0c;
          text-align: center;
          margin: 0;
        }

        .inner-title {
          font-size: 30px;
        }

        /* --- CARDS DA PÁGINA --- */
        .card-aluno {
          background-color: #f5f5f5;
          border-radius: 16px;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .card-profile {
          align-items: center;
        }

        .settings-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        /* --- AVATAR --- */
        .avatar-wrapper {
          position: relative;
          width: 110px;
          height: 110px;
          margin-bottom: 20px;
        }

        .avatar-circle {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: #cccccc;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .avatar-icon {
          width: 90px;
          height: 90px;
        }

        .edit-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: #0d1137;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* --- INPUTS --- */
        .form-group {
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }

        .field-label {
          font-size: 16px;
          font-weight: bold;
          color: #000000;
          margin-bottom: 4px;
        }

        .input-field {
          width: 100%;
          background-color: #dcdcdc;
          border: none;
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 14px;
          font-weight: 500;
          color: #555555;
          box-sizing: border-box;
          outline: none;
        }

        /* --- BOTÃO EDITAR --- */
        .btn-editar {
          background-color: #6d0707;
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 8px 36px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 12px;
        }

        /* --- ESTRUTURA UNIFICADA DA PREDEFINIÇÃO --- */
        .predefinir-card-wrapper {
          background-color: #f5f5f5;
          border-radius: 16px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .card-header-banner {
          padding: 12px;
          text-align: center;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .card-header-banner:hover {
          background-color: #ebebeb;
        }

        /* --- EXPANSÃO SUAVE DO CONTEÚDO --- */
        .expand-content {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }

        .expand-content.open {
          max-height: 500px;
          opacity: 1;
        }

        /* --- CONTEÚDO DOS DIAS DENTRO DO CARD UNIFICADO --- */
        .dias-container {
          padding: 13px 16px 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .day-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .day-label {
          font-size: 16px;
          font-weight: bold;
          color: #000000;
        }

        /* --- SWITCH TOGGLE --- */
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
          background-color: #2b2323;
          transition: .3s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 4px;
          bottom: 4px;
          background-color: #ffffff;
          transition: .3s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #0d1137;
        }

        input:checked + .slider:before {
          transform: translateX(22px);
        }

        /* --- BOTÃO ENVIAR PRÉ-DEFINIÇÃO --- */
        .btn-enviar-predefinicao {
          width: 80%;
          margin: 12px auto 4px auto;
          background-color: #0d1137;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          padding: 12px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        /* MEDIA QUERIES (Ajuste exato aprovado) */
        @media (min-width: 600px) and (max-width: 768px) {
          .content {
            padding-top: 0px;
            transform: translateY(-60px);
            max-width: 700px;
          }
        }

        @media (min-width: 769px) {
          .content {
            padding-top: 35px;
            max-width: 600px;
          }
        }
      `}</style>
    </>
  )
}

export default TelaPerfilAluno