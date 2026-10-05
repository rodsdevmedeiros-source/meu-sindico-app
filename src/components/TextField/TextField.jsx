import { useId, useState } from 'react'
import './TextField.css'

/**
 * Campo de formulario reutilizavel com label, mensagem de erro e
 * suporte a alternancia de visibilidade para senhas.
 *
 * @param {string}  label
 * @param {string}  [type='text']
 * @param {string}  value
 * @param {Function} onChange   recebe o evento nativo
 * @param {string}  [erro]      mensagem de erro a exibir
 * @param {string}  [dica]      texto auxiliar abaixo do campo
 * @param {string}  [placeholder]
 * @param {string}  [autoComplete]
 */
function TextField({
  label,
  type = 'text',
  value,
  onChange,
  erro,
  dica,
  placeholder,
  autoComplete,
  ...rest
}) {
  const id = useId()
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const ehSenha = type === 'password'
  const tipoFinal = ehSenha && mostrarSenha ? 'text' : type

  return (
    <div className="text-field">
      <label className="text-field__label" htmlFor={id}>
        {label}
      </label>
      <div className="text-field__control">
        <input
          id={id}
          className={`text-field__input ${erro ? 'text-field__input--erro' : ''}`}
          type={tipoFinal}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(erro)}
          {...rest}
        />
        {ehSenha && (
          <button
            type="button"
            className="text-field__toggle"
            onClick={() => setMostrarSenha((v) => !v)}
            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {mostrarSenha ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {erro ? (
        <span className="text-field__erro">{erro}</span>
      ) : (
        dica && <span className="text-field__dica">{dica}</span>
      )}
    </div>
  )
}

export default TextField
