import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../axios/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const carregarSessao = useCallback(async () => {
    try {
      const resposta = await api.get('/api/v1/sessao');
      setUsuario(resposta.data.usuario);
    } catch {
      setUsuario(null);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarSessao();
    const aoExpirar = () => setUsuario(null);
    window.addEventListener('auth:expirada', aoExpirar);
    return () => window.removeEventListener('auth:expirada', aoExpirar);
  }, [carregarSessao]);

  const sair = useCallback(async () => {
    try { await api.post('/api/v1/autenticacao/logout'); } catch {}
    setUsuario(null);
  }, []);

  const valor = useMemo(() => ({ usuario, carregando, setUsuario, carregarSessao, sair }), [usuario, carregando, carregarSessao, sair]);
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  return contexto;
}
