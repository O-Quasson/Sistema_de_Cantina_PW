import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import livroslogo from '../../assets/livroslogo.png';
import calendario from '../../assets/calendario.png';
import api from '../../axios/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { campoPredefinicao, dataHojeISO, ehFimDeSemana, formatoHorarioLimite, getDatasDaSemana, nomeDoDia, OPCOES_QUANTIDADE, paraExibicao, paraISO, prazoExpirado } from '../../utils/datas.js';
import { urlImagem } from '../../utils/imagens.js';
import '../../estilos/aluno.css';

const ROTULOS_DIA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export default function TelaInicialAluno() {
  const { usuario } = useAuth();
  const hoje = dataHojeISO();
  const [semanaOffset, setSemanaOffset] = useState(0);
  const dates = useMemo(() => getDatasDaSemana(semanaOffset), [semanaOffset]);
  const [selectedDate, setSelectedDate] = useState(hoje);
  const [cardapio, setCardapio] = useState(null);
  const [pedido, setPedido] = useState(null);
  const [predefinicao, setPredefinicao] = useState(null);
  const [ireiComer, setIreiComer] = useState(false);
  const [quantidade, setQuantidade] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const dataSelecionada = useMemo(() => new Date(`${selectedDate}T12:00:00`), [selectedDate]);
  const finalDeSemana = ehFimDeSemana(dataSelecionada);
  const ehHoje = selectedDate === hoje;
  const ehFuturo = selectedDate > hoje;
  const limiteEncerrado = prazoExpirado(selectedDate);
  const podeResponder = !finalDeSemana && (ehHoje || ehFuturo) && !limiteEncerrado && Boolean(cardapio);
  const campoPredef = campoPredefinicao(dataSelecionada);
  const regraPredef = predefinicao && campoPredef
    ? { vaiComer: Boolean(predefinicao[campoPredef]), porcao: predefinicao[campoPredef] ? predefinicao.porcaoPadrao : null }
    : null;
  const respostaEhPredefinicao = pedido?.origem === 'PREDEFINICAO';

  useEffect(() => {
    const primeiraPermitida = dates.find((date) => paraISO(date) >= hoje) || dates[dates.length - 1];
    setSelectedDate(semanaOffset === 0 ? hoje : paraISO(primeiraPermitida));
  }, [semanaOffset, dates, hoje]);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setMensagem('');

    const buscar = async () => {
      const [cardapioRes, pedidoRes, predefRes] = await Promise.all([
        finalDeSemana ? Promise.resolve({ data: null }) : api.get(`/api/v1/cardapios/${selectedDate}`).catch(() => ({ data: null })),
        api.get(`/api/v1/aluno/pedido/${selectedDate}`).catch(() => ({ data: null })),
        api.get('/api/v1/aluno/predefinicao').catch(() => ({ data: null }))
      ]);
      if (!ativo) return;
      setCardapio(cardapioRes.data);
      setPedido(pedidoRes.data);
      setPredefinicao(predefRes.data);
      setIreiComer(Boolean(pedidoRes.data?.vaiComer));
      setQuantidade(pedidoRes.data?.porcao || '');
      setCarregando(false);
    };

    buscar().catch(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [selectedDate, usuario?.id, hoje, finalDeSemana]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    socket.on('cardapio:atualizado', (atualizado) => {
      if (atualizado?.data === selectedDate) setCardapio(atualizado);
    });
    return () => socket.disconnect();
  }, [selectedDate]);

  const handleEnviar = async (event) => {
    event.preventDefault();
    if (!podeResponder) return;
    if (ireiComer && !quantidade) return setMensagem('Escolha a quantidade antes de enviar.');
    setEnviando(true);
    setMensagem('');
    try {
      const resposta = await api.post('/api/v1/aluno/pedidos', {
        data: selectedDate,
        vaiComer: ireiComer,
        porcao: ireiComer ? quantidade : null
      });
      setPedido(resposta.data);
      setMensagem('Sua resposta foi registrada com sucesso.');
    } catch (error) {
      setMensagem(error.response?.data?.erro || 'Não foi possível registrar sua resposta.');
    } finally {
      setEnviando(false);
    }
  };

  const reaplicarPredefinicao = async () => {
    if (!podeResponder || !regraPredef) return;
    setEnviando(true);
    setMensagem('');
    try {
      const resposta = await api.post(`/api/v1/aluno/pedidos/${selectedDate}/reaplicar-predefinicao`);
      setPedido(resposta.data);
      setIreiComer(Boolean(resposta.data.vaiComer));
      setQuantidade(resposta.data.porcao || '');
      setMensagem('A pré-definição voltou a valer para este dia.');
    } catch (error) {
      setMensagem(error.response?.data?.erro || 'Não foi possível reaplicar a pré-definição.');
    } finally {
      setEnviando(false);
    }
  };

  const descricaoDisponibilidade = finalDeSemana
    ? 'Não há almoço disponível.'
    : !cardapio
      ? 'Não há almoço disponível para este dia.'
      : null;

  return (
    <main className="aluno-page">
      <div className="aluno-content">
        <h2 className="welcome-text">Olá{usuario?.nome ? `, ${usuario.nome.split(' ')[0]}` : ''}</h2>

        <div className="semana-nav">
          <button type="button" className="semana-nav-btn" disabled={semanaOffset === 0} onClick={() => setSemanaOffset((atual) => Math.max(0, atual - 1))}>‹ Semana anterior</button>
          <button type="button" className="semana-nav-btn" onClick={() => setSemanaOffset((atual) => atual + 1)}>Próxima semana ›</button>
        </div>

        <div className="calendar-selector" aria-label="Seleção de dia">
          <div className="dates-grid">
            {dates.map((date) => {
              const iso = paraISO(date);
              const indisponivel = iso < hoje;
              return (
                <button key={iso} type="button" className={`date-item ${selectedDate === iso ? 'active' : ''} ${indisponivel ? 'disabled' : ''} ${ehFimDeSemana(date) ? 'weekend' : ''}`} disabled={indisponivel} onClick={() => setSelectedDate(iso)} aria-label={`${nomeDoDia(date)}, ${paraExibicao(date)}${ehFimDeSemana(date) ? ', sem almoço disponível' : ''}`}>
                  <span className="date-day">{ROTULOS_DIA[date.getDay()]}</span>
                  {paraExibicao(date)}
                </button>
              );
            })}
          </div>
          <img src={calendario} className="calendar-icon-img" alt="Calendário" />
        </div>

        <section className="card-aluno">
          <h3 className="card-title">Almoço de {nomeDoDia(dataSelecionada)} — {paraExibicao(dataSelecionada)}</h3>
          <div className={`food-image-container ${!cardapio ? 'food-image-empty' : ''}`}>
            {cardapio?.imagemUrl ? (
              <img src={urlImagem(cardapio.imagemUrl)} alt="Foto do almoço" className="food-image" />
            ) : (
              <div className="food-image-empty-content" aria-hidden="true">
                <span>Não há almoço disponível</span>
              </div>
            )}
          </div>

          {carregando ? (
            <div className="status-box">Carregando informações do almoço...</div>
          ) : cardapio ? (
            <div className="ingredientes-lista">
              <strong>Ingredientes</strong>
              <ul>{cardapio.ingredientes.map((ingrediente) => <li key={ingrediente.id}>{ingrediente.nome}</li>)}</ul>
            </div>
          ) : (
            <div className="status-box"><strong>{descricaoDisponibilidade}</strong></div>
          )}
        </section>

        {!carregando && cardapio && !finalDeSemana && (
          <section className="card-aluno">
            <form onSubmit={handleEnviar}>
              <div className="response-switch-row">
                <div>
                  <div className="switch-label">Resposta do almoço</div>
                  <div className="switch-status">{pedido ? (ireiComer ? 'Vou almoçar' : 'Não vou almoçar') : 'Ainda não respondi'}</div>
                  {pedido && <div className="predefinicao-info">{respostaEhPredefinicao ? 'Sua resposta foi gerada pela pré-definição.' : 'Sua resposta manual prevalece sobre a pré-definição neste dia.'}</div>}
                </div>
                <label className="switch">
                  <input type="checkbox" checked={ireiComer} disabled={!podeResponder || enviando} onChange={(event) => { setIreiComer(event.target.checked); if (!event.target.checked) setQuantidade(''); }} />
                  <span className="slider" />
                </label>
              </div>

              {ehHoje && limiteEncerrado && <p className="mensagem-prazo">O prazo para responder terminou às {formatoHorarioLimite()}.</p>}
              {ehFuturo && !limiteEncerrado && !pedido && <p className="mensagem-prazo mensagem-prazo-ok">Você pode responder antecipadamente para este dia.</p>}

              {ireiComer && (
                <div className="quantidade-section">
                  <span className="quantidade-title">Quantidade</span>
                  <div className="options-list">
                    {OPCOES_QUANTIDADE.map((qtd) => (
                      <button key={qtd} type="button" className={`option-btn ${quantidade === qtd ? 'selected' : ''}`} disabled={!podeResponder || enviando} onClick={() => setQuantidade(qtd)}>{qtd}</button>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="btn-enviar" disabled={!podeResponder || enviando}>
                {enviando ? 'Salvando...' : pedido ? 'Alterar resposta' : 'Enviar resposta'}
              </button>

              {pedido && !respostaEhPredefinicao && regraPredef && (
                <button type="button" className="btn-secundario" disabled={!podeResponder || enviando} onClick={reaplicarPredefinicao}>
                  Usar pré-definição neste dia
                </button>
              )}

              {mensagem && <p className="mensagem-envio" role="status">{mensagem}</p>}
            </form>
          </section>
        )}


        <footer className="footer-logo">
          <img src={livroslogo} alt="Logo ETEC Bento Quirino" className="footer-logo-img" />
          <div className="footer-logo-text">Bento Quirino</div>
          <hr className="footer-divider" />
          <div className="footer-logo-sub">ESCOLA TÉCNICA ESTADUAL</div>
        </footer>
      </div>
    </main>
  );
}
