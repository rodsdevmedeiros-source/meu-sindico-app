import StatCard from '../../components/StatCard/StatCard.jsx'
import Card from '../../components/Card/Card.jsx'
import './Dashboard.css'

const estatisticas = [
  {
    icone: '💰',
    rotulo: 'Arrecadação do mês',
    valor: 'R$ 48.250',
    variacao: '8% vs. mês anterior',
    tendencia: 'up',
    cor: '#16a34a',
  },
  {
    icone: '⚠️',
    rotulo: 'Inadimplência',
    valor: '6,4%',
    variacao: '1,2% em relação ao mês',
    tendencia: 'down',
    cor: '#dc2626',
  },
  {
    icone: '🏠',
    rotulo: 'Unidades',
    valor: '120',
    variacao: '112 ocupadas',
    tendencia: 'neutral',
    cor: '#2563eb',
  },
  {
    icone: '📅',
    rotulo: 'Reservas na semana',
    valor: '9',
    variacao: '3 pendentes',
    tendencia: 'neutral',
    cor: '#0ea5e9',
  },
]

const atividades = [
  { icone: '✅', texto: 'Boleto da unidade 302 foi pago', tempo: 'há 20 min' },
  { icone: '📢', texto: 'Comunicado "Manutenção do elevador" enviado', tempo: 'há 2 h' },
  { icone: '📅', texto: 'Reserva do salão de festas aprovada (Ap. 1101)', tempo: 'há 5 h' },
  { icone: '🔧', texto: 'Chamado de manutenção aberto: portão da garagem', tempo: 'ontem' },
  { icone: '👤', texto: 'Novo morador cadastrado na unidade 804', tempo: 'ontem' },
]

const inadimplentes = [
  { unidade: 'Ap. 203', morador: 'Marina Alves', valor: 'R$ 450,00', meses: 2 },
  { unidade: 'Ap. 507', morador: 'Rogério Lima', valor: 'R$ 900,00', meses: 2 },
  { unidade: 'Ap. 112', morador: 'Fernanda Dias', valor: 'R$ 450,00', meses: 1 },
  { unidade: 'Ap. 909', morador: 'Paulo Mendes', valor: 'R$ 1.350,00', meses: 3 },
]

const reservas = [
  { area: 'Salão de festas', data: 'Sáb, 11/10 • 19h', morador: 'Ap. 1101', status: 'Confirmada' },
  { area: 'Churrasqueira', data: 'Dom, 12/10 • 12h', morador: 'Ap. 304', status: 'Pendente' },
  { area: 'Quadra', data: 'Ter, 14/10 • 18h', morador: 'Ap. 702', status: 'Confirmada' },
]

/**
 * Pagina principal do dashboard (Visao Geral) da Area do Sindico.
 * Reune as metricas e informacoes mais relevantes para o gestor.
 */
function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1>Visão Geral</h1>
          <p>Bem-vindo de volta, Carlos. Aqui está o resumo do Condomínio Jardins.</p>
        </div>
        <button className="dashboard__cta" type="button">
          + Novo comunicado
        </button>
      </header>

      {/* Estatisticas */}
      <div className="dashboard__stats">
        {estatisticas.map((e) => (
          <StatCard key={e.rotulo} {...e} />
        ))}
      </div>

      {/* Grid principal */}
      <div className="dashboard__grid">
        <Card titulo="Atividades recentes" acaoLabel="Ver tudo">
          <ul className="dashboard__timeline">
            {atividades.map((a, i) => (
              <li className="dashboard__timeline-item" key={i}>
                <span className="dashboard__timeline-icon">{a.icone}</span>
                <div className="dashboard__timeline-body">
                  <span>{a.texto}</span>
                  <small>{a.tempo}</small>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card titulo="Inadimplência" acaoLabel="Cobrar">
          <ul className="dashboard__lista">
            {inadimplentes.map((item, i) => (
              <li className="dashboard__lista-item" key={i}>
                <div>
                  <strong>{item.unidade}</strong>
                  <small>{item.morador}</small>
                </div>
                <div className="dashboard__lista-right">
                  <strong className="dashboard__valor-vermelho">{item.valor}</strong>
                  <span className="dashboard__tag dashboard__tag--alerta">
                    {item.meses} {item.meses > 1 ? 'meses' : 'mês'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card titulo="Próximas reservas" acaoLabel="Agenda">
          <ul className="dashboard__lista">
            {reservas.map((r, i) => (
              <li className="dashboard__lista-item" key={i}>
                <div>
                  <strong>{r.area}</strong>
                  <small>
                    {r.data} • {r.morador}
                  </small>
                </div>
                <span
                  className={`dashboard__tag ${
                    r.status === 'Confirmada'
                      ? 'dashboard__tag--ok'
                      : 'dashboard__tag--pendente'
                  }`}
                >
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card titulo="Resumo financeiro do mês">
          <div className="dashboard__finance">
            <div className="dashboard__finance-row">
              <span>Receitas</span>
              <strong className="dashboard__valor-verde">R$ 48.250</strong>
            </div>
            <div className="dashboard__bar">
              <div className="dashboard__bar-fill dashboard__bar-fill--verde" style={{ width: '82%' }} />
            </div>
            <div className="dashboard__finance-row">
              <span>Despesas</span>
              <strong className="dashboard__valor-vermelho">R$ 39.600</strong>
            </div>
            <div className="dashboard__bar">
              <div className="dashboard__bar-fill dashboard__bar-fill--vermelho" style={{ width: '67%' }} />
            </div>
            <div className="dashboard__saldo">
              <span>Saldo do fundo de reserva</span>
              <strong>R$ 86.900</strong>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
