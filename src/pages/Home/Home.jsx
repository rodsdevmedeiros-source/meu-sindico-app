import './Home.css'

const recursos = [
  {
    icone: '👥',
    titulo: 'Gestão de Moradores',
    descricao:
      'Cadastre unidades, proprietários e inquilinos com histórico completo e organizado.',
  },
  {
    icone: '💰',
    titulo: 'Controle Financeiro',
    descricao:
      'Acompanhe boletos, inadimplência, despesas e gere relatórios em poucos cliques.',
  },
  {
    icone: '📢',
    titulo: 'Comunicados',
    descricao:
      'Envie avisos e circulares para todo o condomínio de forma rápida e centralizada.',
  },
  {
    icone: '📅',
    titulo: 'Reservas de Áreas',
    descricao:
      'Gerencie o uso de salão de festas, churrasqueira e demais espaços comuns.',
  },
]

const estatisticas = [
  { valor: '+500', rotulo: 'Condomínios' },
  { valor: '98%', rotulo: 'Satisfação' },
  { valor: '24/7', rotulo: 'Disponibilidade' },
]

/**
 * Pagina inicial (landing) do Meu Sindico App.
 * Apresenta o produto com hero, estatisticas e recursos principais.
 */
function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-content">
          <span className="home__badge">Gestão condominial simplificada</span>
          <h1 className="home__title">
            A forma mais inteligente de administrar o seu condomínio
          </h1>
          <p className="home__subtitle">
            Centralize moradores, finanças, comunicados e reservas em um só
            lugar. Menos burocracia, mais tranquilidade para o síndico e para os
            moradores.
          </p>
          <div className="home__hero-actions">
            <button className="home__cta home__cta--primary" type="button">
              Começar agora
            </button>
            <button className="home__cta home__cta--ghost" type="button">
              Ver demonstração
            </button>
          </div>

          <div className="home__stats">
            {estatisticas.map((item) => (
              <div className="home__stat" key={item.rotulo}>
                <span className="home__stat-valor">{item.valor}</span>
                <span className="home__stat-rotulo">{item.rotulo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="home__hero-art" aria-hidden="true">
          <div className="home__card-float home__card-float--1">
            <span>💰</span>
            <div>
              <strong>Taxa condominial</strong>
              <small>Paga • R$ 450,00</small>
            </div>
          </div>
          <div className="home__card-float home__card-float--2">
            <span>📅</span>
            <div>
              <strong>Salão de festas</strong>
              <small>Reservado • Sáb 19h</small>
            </div>
          </div>
          <div className="home__hero-building">🏢</div>
        </div>
      </section>

      {/* Recursos */}
      <section className="home__features">
        <div className="home__section-head">
          <h2>Tudo o que o seu condomínio precisa</h2>
          <p>
            Ferramentas pensadas para o dia a dia da administração condominial.
          </p>
        </div>

        <div className="home__features-grid">
          {recursos.map((recurso) => (
            <article className="home__feature-card" key={recurso.titulo}>
              <div className="home__feature-icon">{recurso.icone}</div>
              <h3>{recurso.titulo}</h3>
              <p>{recurso.descricao}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Chamada final */}
      <section className="home__final-cta">
        <h2>Pronto para modernizar a gestão do seu condomínio?</h2>
        <p>Experimente o Meu Síndico App e simplifique a sua rotina.</p>
        <button className="home__cta home__cta--primary" type="button">
          Criar conta gratuita
        </button>
      </section>
    </div>
  )
}

export default Home
