import { useState } from 'react';

function IconeOlho({ ocultar = false }) {
  return ocultar ? (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
      <path d="M9.9 5.3A10.8 10.8 0 0 1 12 5c5 0 8.7 4.2 9.7 7a15 15 0 0 1-3.2 3.8" />
      <path d="M6.3 6.4C4 7.7 2.7 9.9 2.3 12c.9 1.8 4.2 7 9.7 7 1.1 0 2.1-.2 3-.6" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2.3 12c1.2-2.2 4.6-6 9.7-6s8.5 3.8 9.7 6c-1.2 2.2-4.6 6-9.7 6s-8.5-3.8-9.7-6Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

export default function CampoSenha({
  id,
  name = 'senha',
  value,
  onChange,
  disabled = false,
  required = true,
  autoComplete = 'current-password',
  placeholder = '',
  className = '',
  minLength,
  maxLength
}) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className={`campo-senha ${className}`.trim()}>
      <input
        id={id}
        name={name}
        type={visivel ? 'text' : 'password'}
        className="form-input"
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <button
        type="button"
        className="botao-visualizar-senha"
        onClick={() => setVisivel((atual) => !atual)}
        aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visivel}
        disabled={disabled}
      >
        <IconeOlho ocultar={visivel} />
      </button>
    </div>
  );
}
