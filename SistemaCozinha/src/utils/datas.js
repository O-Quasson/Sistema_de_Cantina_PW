export const LIMITE_HORA_PEDIDO = 10;
export const LIMITE_MINUTO_PEDIDO = 30;
export const OPCOES_QUANTIDADE = ['200g', '300g', '400g', '500g'];

const NOMES_DIA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function partesAgoraBrasilia() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).formatToParts(new Date()).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});
}

function dataBrasiliaComoDate() {
  const partes = partesAgoraBrasilia();
  return new Date(Number(partes.year), Number(partes.month) - 1, Number(partes.day), 12);
}

export function paraISO(date) {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export function paraExibicao(date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function nomeDoDia(date) {
  return NOMES_DIA[date.getDay()];
}

export function getDatasDaSemana(offsetSemanas = 0) {
  const hoje = dataBrasiliaComoDate();
  const dia = hoje.getDay();
  const deslocamentoSegunda = dia === 0 ? -6 : 1 - dia;
  const segunda = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + deslocamentoSegunda + offsetSemanas * 7, 12);
  return Array.from({ length: 7 }, (_, index) => new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + index, 12));
}

export function dataHojeISO() {
  const partes = partesAgoraBrasilia();
  return `${partes.year}-${partes.month}-${partes.day}`;
}

export function ehFimDeSemana(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

export function prazoExpirado(dataISO) {
  const hoje = dataHojeISO();
  if (dataISO < hoje) return true;
  if (dataISO > hoje) return false;
  const partes = partesAgoraBrasilia();
  return Number(partes.hour) > LIMITE_HORA_PEDIDO || (Number(partes.hour) === LIMITE_HORA_PEDIDO && Number(partes.minute) >= LIMITE_MINUTO_PEDIDO);
}

export function formatoHorarioLimite() {
  return '10:30';
}

export function campoPredefinicao(date) {
  return [null, 'segunda', 'terca', 'quarta', 'quinta', 'sexta', null][date.getDay()];
}
