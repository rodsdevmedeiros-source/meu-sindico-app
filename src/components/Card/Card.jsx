import './Card.css'

/**
 * Painel generico com cabecalho opcional, usado para agrupar
 * conteudos no dashboard.
 *
 * @param {string}   [titulo]      Titulo do cabecalho
 * @param {string}   [acaoLabel]   Texto do botao de acao no canto
 * @param {Function} [onAcao]      Callback do botao de acao
 * @param {React.ReactNode} children Conteudo do corpo
 */
function Card({ titulo, acaoLabel, onAcao, children }) {
  return (
    <section className="card">
      {(titulo || acaoLabel) && (
        <header className="card__head">
          {titulo && <h3 className="card__title">{titulo}</h3>}
          {acaoLabel && (
            <button className="card__action" type="button" onClick={onAcao}>
              {acaoLabel}
            </button>
          )}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  )
}

export default Card
