import { useId } from 'react'
import './SelectField.css'

/**
 * Campo de selecao reutilizavel com label e mensagem de erro.
 *
 * @param {string}  label
 * @param {string}  value
 * @param {Function} onChange
 * @param {Array<{value:string,label:string}>} opcoes
 * @param {string}  [erro]
 * @param {string}  [placeholder] opcao vazia inicial
 */
function SelectField({ label, value, onChange, opcoes, erro, placeholder }) {
  const id = useId()

  return (
    <div className="select-field">
      <label className="select-field__label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={`select-field__control ${erro ? 'select-field__control--erro' : ''}`}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(erro)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {opcoes.map((op) => (
          <option key={op.value} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      {erro && <span className="select-field__erro">{erro}</span>}
    </div>
  )
}

export default SelectField
