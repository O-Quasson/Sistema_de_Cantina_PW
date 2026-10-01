export function urlImagem(caminho) {
  if (!caminho) return '';
  if (/^https?:\/\//i.test(caminho)) return caminho;
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/${caminho.replace(/^\//, '')}`;
}
