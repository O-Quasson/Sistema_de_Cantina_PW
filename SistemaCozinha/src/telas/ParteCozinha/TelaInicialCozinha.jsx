import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import cozinheiros from '../../assets/cozinheiros.png';
import livroslogo from '../../assets/livroslogo.png';
import calendario from '../../assets/calendario.png';
import api from '../../axios/api.js';
import { dataHojeISO, ehFimDeSemana, getDatasDaSemana, nomeDoDia, OPCOES_QUANTIDADE, paraExibicao, paraISO, prazoExpirado } from '../../utils/datas.js';
import { urlImagem } from '../../utils/imagens.js';
import ListaIngredientes from '../../componentes/ListaIngredientes.jsx';
import '../../estilos/cozinha.css';

function normalizarIngrediente(nome) {
  return nome.trim().replace(/\s+/g, ' ');
}
function chaveIngrediente(nome) {
  return normalizarIngrediente(nome).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

const ESTADO_VAZIO = { naoVaoComer: 0, '200g': 0, '300g': 0, '400g': 0, '500g': 0 };

export default function TelaInicialCozinha() {
  const hoje = dataHojeISO();
  const [semanaOffset, setSemanaOffset] = useState(0);
  const dates = useMemo(() => getDatasDaSemana(semanaOffset), [semanaOffset]);
  const [selectedDate, setSelectedDate] = useState(hoje);
  const [cardapio, setCardapio] = useState(null);
  const [novoIngrediente, setNovoIngrediente] = useState('');
  const [ingredientes, setIngredientes] = useState([]);
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [previewImagem, setPreviewImagem] = useState('');
  const previewLocalRef = useRef('');
  const dataAtualRef = useRef(selectedDate);
  const [salvando, setSalvando] = useState(false);
  const [mensagemCardapio, setMensagemCardapio] = useState('');
  const [resumo, setResumo] = useState(null);
  const [sobraInput, setSobraInput] = useState('');
  const [salvandoSobra, setSalvandoSobra] = useState(false);
  const [mensagemSobra, setMensagemSobra] = useState('');
  const [cardapioAberto, setCardapioAberto] = useState(true);
  const [resumoAberto, setResumoAberto] = useState(true);

  dataAtualRef.current = selectedDate;
  const dataSelecionada = useMemo(() => new Date(`${selectedDate}T12:00:00`), [selectedDate]);
  const finalDeSemana = ehFimDeSemana(dataSelecionada);
  const diaPassado = selectedDate < hoje;
  const editavel = !finalDeSemana && !diaPassado && !prazoExpirado(selectedDate);
  const sobraEditavel = Boolean(cardapio) && selectedDate === hoje;

  const atualizarCardapio = useCallback(async () => {
    if (finalDeSemana) {
      setCardapio(null);
      setIngredientes([]);
      setSobraInput('');
      if (previewLocalRef.current) {
        URL.revokeObjectURL(previewLocalRef.current);
        previewLocalRef.current = '';
      }
      setPreviewImagem('');
      return;
    }
    try {
      const resposta = await api.get(`/api/v1/cardapios/${selectedDate}`);
      if (dataAtualRef.current !== selectedDate) return;
      const dados = resposta.data;
      setCardapio(dados);
      setIngredientes(dados?.ingredientes?.map((item) => item.nome) || []);
      setSobraInput(dados?.sobraKg ?? '');
      if (previewLocalRef.current) {
        URL.revokeObjectURL(previewLocalRef.current);
        previewLocalRef.current = '';
      }
      setPreviewImagem(dados?.imagemUrl ? urlImagem(dados.imagemUrl) : '');
    } catch {
      if (dataAtualRef.current !== selectedDate) return;
      if (previewLocalRef.current) {
        URL.revokeObjectURL(previewLocalRef.current);
        previewLocalRef.current = '';
      }
      setCardapio(null);
      setIngredientes([]);
      setSobraInput('');
      setPreviewImagem('');
    }
  }, [finalDeSemana, selectedDate]);

  const atualizarResumo = useCallback(async () => {
    try {
      const resposta = await api.get(`/api/v1/cozinha/resumos/${selectedDate}`);
      if (dataAtualRef.current === selectedDate) setResumo(resposta.data);
    } catch {
      if (dataAtualRef.current === selectedDate) setResumo(null);
    }
  }, [selectedDate]);

  useEffect(() => {
    setSelectedDate(semanaOffset === 0 ? hoje : paraISO(dates[0]));
  }, [semanaOffset, dates, hoje]);

  useEffect(() => {
    setMensagemCardapio('');
    setMensagemSobra('');
    setArquivoImagem(null);
    setNovoIngrediente('');
    setResumo(null);
    atualizarCardapio();
    atualizarResumo();
  }, [selectedDate, atualizarCardapio, atualizarResumo]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });
    const atualizar = ({ data } = {}) => {
      if (!data || data === selectedDate) atualizarResumo();
    };
    socket.on('resumo:atualizar', atualizar);
    socket.on('resumos:atualizarTudo', atualizarResumo);
    socket.on('cardapio:atualizado', (novo) => {
      if (novo?.data === selectedDate) atualizarCardapio();
    });
    socket.on('cardapio:sobraAtualizada', ({ data, sobraKg }) => {
      if (data === selectedDate) setSobraInput(sobraKg);
    });
    return () => socket.disconnect();
  }, [selectedDate, atualizarCardapio, atualizarResumo]);

  const adicionarIngrediente = () => {
    const nome = normalizarIngrediente(novoIngrediente);
    if (!nome) return;
    if (nome.length > 100) return setMensagemCardapio('Cada ingrediente pode ter no máximo 100 caracteres.');
    if (ingredientes.some((item) => chaveIngrediente(item) === chaveIngrediente(nome))) {
      setMensagemCardapio('Esse ingrediente já está na lista.');
      return;
    }
    setIngredientes((atual) => [...atual, nome].sort((a, b) => a.localeCompare(b, 'pt-BR')));
    setNovoIngrediente('');
    setMensagemCardapio('');
  };

  const removerIngrediente = (nome) => setIngredientes((atual) => atual.filter((item) => item !== nome));

  const selecionarImagem = (event) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    if (!['image/jpeg', 'image/png'].includes(arquivo.type)) {
      setMensagemCardapio('A foto precisa estar em JPG, JPEG ou PNG.');
      event.target.value = '';
      return;
    }
    if (arquivo.size > 8 * 1024 * 1024) {
      setMensagemCardapio('A foto deve ter no máximo 8 MB.');
      event.target.value = '';
      return;
    }
    if (previewLocalRef.current) URL.revokeObjectURL(previewLocalRef.current);
    previewLocalRef.current = URL.createObjectURL(arquivo);
    setArquivoImagem(arquivo);
    setPreviewImagem(previewLocalRef.current);
    setMensagemCardapio('');
  };

  const salvarCardapio = async (event) => {
    event.preventDefault();
    setMensagemCardapio('');
    if (!editavel) return setMensagemCardapio('Este dia está fechado para alterações.');
    if (!arquivoImagem && !cardapio?.imagemUrl) return setMensagemCardapio('Adicione uma foto do almoço.');
    if (!ingredientes.length) return setMensagemCardapio('Cadastre pelo menos um ingrediente.');
    setSalvando(true);
    try {
      const dados = new FormData();
      dados.append('data', selectedDate);
      dados.append('ingredientes', JSON.stringify(ingredientes));
      if (arquivoImagem) dados.append('imagem', arquivoImagem);
      const resposta = await api.post('/api/v1/cardapios', dados);
      setCardapio(resposta.data);
      setIngredientes(resposta.data.ingredientes.map((item) => item.nome));
      setArquivoImagem(null);
      if (previewLocalRef.current) {
        URL.revokeObjectURL(previewLocalRef.current);
        previewLocalRef.current = '';
      }
      setPreviewImagem(urlImagem(resposta.data.imagemUrl));
      setMensagemCardapio(cardapio ? 'Cardápio atualizado com sucesso.' : 'Cardápio publicado com sucesso.');
    } catch (error) {
      setMensagemCardapio(error.response?.data?.erro || 'Não foi possível salvar o cardápio.');
    } finally {
      setSalvando(false);
    }
  };

  const salvarSobra = async (event) => {
    event.preventDefault();
    setMensagemSobra('');
    if (!sobraEditavel) return setMensagemSobra(diaPassado ? 'Datas anteriores são somente para consulta.' : 'A sobra só pode ser registrada no dia do almoço.');
    const valor = Number(sobraInput);
    if (!Number.isFinite(valor) || valor < 0) return setMensagemSobra('Informe uma sobra válida em quilogramas.');
    setSalvandoSobra(true);
    try {
      const resposta = await api.put(`/api/v1/cardapios/${selectedDate}/sobra`, { sobraKg: valor });
      setSobraInput(resposta.data.sobraKg);
      setMensagemSobra('Sobra registrada.');
    } catch (error) {
      setMensagemSobra(error.response?.data?.erro || 'Não foi possível registrar a sobra.');
    } finally {
      setSalvandoSobra(false);
    }
  };

  const contagem = resumo?.contagem || ESTADO_VAZIO;
  const percentuais = resumo?.percentuais || {};
  const max = Math.max(1, contagem.naoVaoComer, resumo?.naoResponderam || 0, ...OPCOES_QUANTIDADE.map((qtd) => contagem[qtd]));

  useEffect(() => () => {
    if (previewLocalRef.current) URL.revokeObjectURL(previewLocalRef.current);
  }, []);

  return (
    <main className="cozinha-page">
      <div className="cozinha-content">
        <div className="semana-nav">
          <button type="button" className="semana-nav-btn" onClick={() => setSemanaOffset((atual) => atual - 1)}>‹ Semana anterior</button>
          <button type="button" className="semana-nav-btn" onClick={() => setSemanaOffset((atual) => atual + 1)}>Próxima semana ›</button>
        </div>

        <div className="calendar-selector" aria-label="Seleção de dia">
          <div className="dates-grid">
            {dates.map((date) => {
              const iso = paraISO(date);
              return (
                <button key={iso} type="button" className={`date-item ${selectedDate === iso ? 'active' : ''} ${ehFimDeSemana(date) ? 'weekend' : ''}`} onClick={() => setSelectedDate(iso)} aria-label={`${nomeDoDia(date)}, ${paraExibicao(date)}${ehFimDeSemana(date) ? ', sem almoço disponível' : ''}`}>
                  <span className="date-day">{nomeDoDia(date).slice(0, 3)}</span>
                  {paraExibicao(date)}
                </button>
              );
            })}
          </div>
          <img src={calendario} alt="Calendário" className="calendar-icon-img" />
        </div>

        <section className="menu-card">
          <button type="button" className="menu-card-header" onClick={() => setCardapioAberto((atual) => !atual)} aria-expanded={cardapioAberto}>
            <span className="menu-title">Cardápio</span>
            <span className="menu-card-action" aria-hidden="true">{cardapioAberto ? '−' : '+'}</span>
          </button>
          {cardapioAberto && (
            <div className="menu-body">
              <h3 className="menu-subtitle">{nomeDoDia(dataSelecionada)} — {paraExibicao(dataSelecionada)}</h3>
              {finalDeSemana ? (
                <p className="status-info">Não há almoço disponível.</p>
              ) : (
                <form onSubmit={salvarCardapio} noValidate>
                  {diaPassado && <p className="history-note">Este cardápio está em histórico e pode ser consultado, mas não alterado.</p>}
                  {!diaPassado && prazoExpirado(selectedDate) && <p className="history-note">O horário de alteração deste dia terminou às 10:30.</p>}
                  <label className={`image-placeholder ${!editavel ? 'readonly' : ''}`} style={previewImagem ? { backgroundImage: `url(${previewImagem})` } : {}}>
                    {!previewImagem && <><span className="plus-icon">+</span><span className="image-help">Adicionar foto do almoço</span></>}
                    {editavel && <input type="file" accept="image/jpeg,image/png" onChange={selecionarImagem} />}
                  </label>

                  <ListaIngredientes
                    ingredientes={ingredientes}
                    novoIngrediente={novoIngrediente}
                    onNovoIngrediente={setNovoIngrediente}
                    editavel={editavel}
                    onAdicionar={adicionarIngrediente}
                    onRemover={removerIngrediente}
                  />

                  {editavel ? (
                    <button className="btn-primary" type="submit" disabled={salvando}>{salvando ? 'Salvando...' : cardapio ? 'Salvar alterações' : 'Publicar cardápio'}</button>
                  ) : null}
                  {mensagemCardapio && <p className="mensagem-cozinha" role="status">{mensagemCardapio}</p>}
                </form>
              )}
            </div>
          )}
        </section>

        <section className="menu-card">
          <button type="button" className="menu-card-header" onClick={() => setResumoAberto((atual) => !atual)} aria-expanded={resumoAberto}>
            <span className="menu-title">Resumo da produção</span>
            <span className="menu-card-action" aria-hidden="true">{resumoAberto ? '−' : '+'}</span>
          </button>
          {resumoAberto && (
            <div className="menu-body">
              {resumo === null ? (
                <p className="status-info">Carregando resumo...</p>
              ) : !resumo.temCardapio ? (
                <p className="status-info">Não há almoço disponível nesta data. O resumo será exibido quando houver cardápio.</p>
              ) : (
                <>
                  <p className="nao-responderam"><strong>{resumo.naoResponderam || 0}</strong> aluno(s) não responderam para este dia. Eles não entram na quantidade a preparar.</p>
                  <div className="summary-grid">
                    <div className="summary-grid-item"><strong>{resumo.totalAlunos || 0}<small>100%</small></strong><span>Alunos cadastrados</span></div>
                    <div className="summary-grid-item"><strong>{resumo.totalRefeicoes || 0}<small>{percentuais.refeicoes || 0}%</small></strong><span>Refeições previstas</span></div>
                    <div className="summary-grid-item"><strong>{contagem.naoVaoComer}<small>{percentuais.naoVaoComer || 0}%</small></strong><span>Não vão comer</span></div>
                    <div className="summary-grid-item"><strong>{resumo.naoResponderam || 0}<small>{percentuais.naoResponderam || 0}%</small></strong><span>Não responderam</span></div>
                    <div className="summary-grid-item"><strong>{Number(resumo.totalGramas || 0).toLocaleString('pt-BR')} g</strong><span>Total previsto</span></div>
                    <div className="summary-grid-item"><strong>{Number(resumo.totalQuilos || 0).toLocaleString('pt-BR')} kg</strong><span>Total previsto</span></div>
                  </div>

                  <div className="chart" aria-label="Distribuição das respostas por quantidade">
                    {[
                      ['não vão comer', contagem.naoVaoComer, percentuais.naoVaoComer || 0],
                      ['não responderam', resumo.naoResponderam || 0, percentuais.naoResponderam || 0],
                      ...OPCOES_QUANTIDADE.map((qtd) => [qtd, contagem[qtd], percentuais[qtd] || 0])
                    ].map(([label, value, percentual]) => (
                      <div className="bar-wrap" key={label}>
                        <span className="bar-value">{value}<small>({percentual}%)</small></span>
                        <div className="bar" style={{ height: `${Math.max(3, (value / max) * 170)}px` }} />
                        <small className="bar-label">{label}</small>
                      </div>
                    ))}
                  </div>

                  <div className="calculo">
                    <h4 className="calculo-title">Cálculo total</h4>
                    <p>200g × {contagem['200g']} + 300g × {contagem['300g']} + 400g × {contagem['400g']} + 500g × {contagem['500g']}</p>
                    <p><strong>{Number(resumo.totalQuilos || 0).toLocaleString('pt-BR')} kg</strong> previstos.</p>
                  </div>

                  <form className="sobra-form" onSubmit={salvarSobra}>
                    <div className="sobra-field">
                      <label htmlFor="sobra">Sobra registrada (kg)</label>
                      <input id="sobra" type="number" min="0" max="10000" step="0.1" value={sobraInput} onChange={(event) => setSobraInput(event.target.value)} placeholder="0,0" disabled={!sobraEditavel || salvandoSobra} />
                    </div>
                    <button className="btn-primary" type="submit" disabled={!sobraEditavel || salvandoSobra}>{salvandoSobra ? 'Salvando...' : 'Registrar sobra'}</button>
                    {!sobraEditavel && !mensagemSobra && <p className="sobra-note">{diaPassado ? 'Esta data está disponível somente para consulta.' : 'A sobra poderá ser registrada no dia do almoço.'}</p>}
                    {mensagemSobra && <p className="mensagem-cozinha" role="status">{mensagemSobra}</p>}
                  </form>
                </>
              )}
            </div>
          )}
        </section>

        <img src={cozinheiros} alt="Cozinha profissional" className="kitchen-img" />
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
