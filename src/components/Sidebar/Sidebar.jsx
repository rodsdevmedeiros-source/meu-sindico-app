import { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './Sidebar.css'

const menu = [
  { label: 'Visão Geral', to: '/area-do-sindico', icone: '📊', end: true },
  { label: 'Moradores', to: '/area-do-sindico/moradores', icone: '👥' },
  { label: 'Financeiro', to: '/area-do-sindico/financeiro', icone: '💰' },
  { label: 'Comunicados', to: '/area-do-sindico/comunicados', icone: '📢' },
  { label: 'Reservas', to: '/area-do-sindico/reservas', icone: '📅' },
  { label: 'Manutenção', to: '/area-do-sindico/manutencao', icone: '🔧' },
  { label: 'Documentos', to: '/area-do-sindico/documentos', icone: '📁' },
]

// Grupo de Cadastros e configuracoes (menu expansivel)
const grupoCadastros = {
  label: 'Cadastros',
  icone: '🗂️',
  base: '/area-do-sindico/cadastros',
  itens: [
    { label: 'Apartamentos', to: '/area-do-sindico/cadastros/apartamentos' },
    { label: 'Moradores', to: '/area-do-sindico/cadastros/moradores' },
    { label: 'Funcionários', to: '/area-do-sindico/cadastros/funcionarios' },
    { label: 'Áreas comuns', to: '/area-do-sindico/cadastros/areas' },
    { label: 'Configurações', to: '/area-do-sindico/cadastros/configuracoes' },
  ],
}

/**
 * Menu lateral do dashboard da Area do Sindico.
 * Possui um grupo expansivel de "Cadastros".
 * Pode ser recolhido em telas menores atraves da prop `aberta`.
 */
function Sidebar({ aberta, onFechar }) {
  const { pathname } = useLocation()
  const grupoAtivo = pathname.startsWith(grupoCadastros.base)
  const [cadastrosAberto, setCadastrosAberto] = useState(grupoAtivo)

  return (
    <>
      <aside className={`sidebar ${aberta ? 'sidebar--aberta' : ''}`}>
        <Link to="/" className="sidebar__brand">
          <span className="sidebar__logo" aria-hidden="true">
            🏢
          </span>
          <span className="sidebar__brand-text">
            Meu Síndico<strong>App</strong>
          </span>
        </Link>

        <nav className="sidebar__nav" aria-label="Menu do painel">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
              }
              onClick={onFechar}
            >
              <span className="sidebar__icon" aria-hidden="true">
                {item.icone}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {/* Grupo expansivel: Cadastros */}
          <div className="sidebar__grupo">
            <button
              type="button"
              className={`sidebar__item sidebar__item--grupo ${
                grupoAtivo ? 'sidebar__item--grupo-ativo' : ''
              }`}
              onClick={() => setCadastrosAberto((v) => !v)}
              aria-expanded={cadastrosAberto}
            >
              <span className="sidebar__icon" aria-hidden="true">
                {grupoCadastros.icone}
              </span>
              <span>{grupoCadastros.label}</span>
              <span
                className={`sidebar__chevron ${
                  cadastrosAberto ? 'sidebar__chevron--aberto' : ''
                }`}
                aria-hidden="true"
              >
                ›
              </span>
            </button>

            {cadastrosAberto && (
              <div className="sidebar__submenu">
                {grupoCadastros.itens.map((sub) => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    className={({ isActive }) =>
                      `sidebar__subitem ${
                        isActive ? 'sidebar__subitem--active' : ''
                      }`
                    }
                    onClick={onFechar}
                  >
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <span className="sidebar__avatar" aria-hidden="true">
              CS
            </span>
            <div className="sidebar__user-info">
              <strong>Carlos Síndico</strong>
              <small>Condomínio Jardins</small>
            </div>
          </div>
          <div className="sidebar__footer-links">
            <Link to="/" className="sidebar__sair" onClick={onFechar}>
              🏠 Ir para o site
            </Link>
            <Link to="/login" className="sidebar__sair" onClick={onFechar}>
              Sair
            </Link>
          </div>
        </div>
      </aside>

      {aberta && (
        <div
          className="sidebar__overlay"
          onClick={onFechar}
          aria-hidden="true"
        />
      )}
    </>
  )
}

export default Sidebar
