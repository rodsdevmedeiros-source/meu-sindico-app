import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Toolbar.css'

const navItems = [
  { label: 'Início', to: '/' },
  { label: 'Moradores', to: '/moradores' },
  { label: 'Financeiro', to: '/financeiro' },
  { label: 'Comunicados', to: '/comunicados' },
  { label: 'Reservas', to: '/reservas' },
]

/**
 * Toolbar fixa no topo da aplicacao.
 * Possui marca, navegacao principal e acoes do usuario.
 * Responsiva: em telas pequenas o menu vira um painel recolhivel.
 */
function Toolbar() {
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header className="toolbar">
      <div className="toolbar__inner">
        <Link className="toolbar__brand" to="/">
          <span className="toolbar__logo" aria-hidden="true">
            🏢
          </span>
          <span className="toolbar__brand-text">
            Meu Síndico<strong>App</strong>
          </span>
        </Link>

        <nav
          className={`toolbar__nav ${menuAberto ? 'toolbar__nav--open' : ''}`}
          aria-label="Navegação principal"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `toolbar__link ${isActive ? 'toolbar__link--active' : ''}`
              }
              onClick={() => setMenuAberto(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="toolbar__actions">
          <Link to="/login" className="toolbar__btn toolbar__btn--ghost">
            Entrar
          </Link>
          <Link
            to="/area-do-sindico"
            className="toolbar__btn toolbar__btn--primary"
          >
            Área do Síndico
          </Link>
          <button
            className="toolbar__hamburger"
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            onClick={() => setMenuAberto((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Toolbar
