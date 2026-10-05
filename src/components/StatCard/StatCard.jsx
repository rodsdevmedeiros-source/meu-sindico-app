import './StatCard.css'

/**
 * Card de estatistica para o dashboard.
 *
 * @param {string} icone      Emoji/icone representativo
 * @param {string} rotulo     Titulo da metrica
 * @param {string} valor      Valor principal em destaque
 * @param {string} [variacao] Texto de variacao (ex: "+12%")
 * @param {'up'|'down'|'neutral'} [tendencia] Direcao da variacao
 * @param {string} [cor]      Cor de acento do card
 */
function StatCard({ icone, rotulo, valor, variacao, tendencia = 'neutral', cor = '#2563eb' }) {
  return (
    <article className="stat-card">
      <div
        className="stat-card__icon"
        style={{ background: `${cor}1a`, color: cor }}
      >
        {icone}
      </div>
      <div className="stat-card__body">
        <span className="stat-card__rotulo">{rotulo}</span>
        <strong className="stat-card__valor">{valor}</strong>
        {variacao && (
          <span className={`stat-card__variacao stat-card__variacao--${tendencia}`}>
            {tendencia === 'up' ? '▲' : tendencia === 'down' ? '▼' : '•'} {variacao}
          </span>
        )}
      </div>
    </article>
  )
}

export default StatCard
