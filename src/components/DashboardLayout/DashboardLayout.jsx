import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar.jsx'
import './DashboardLayout.css'

/**
 * Layout da Area do Sindico: menu lateral fixo + area de conteudo.
 * Controla a abertura da sidebar em telas menores.
 */
function DashboardLayout() {
  const [sidebarAberta, setSidebarAberta] = useState(false)

  return (
    <div className="dashboard-layout">
      <Sidebar
        aberta={sidebarAberta}
        onFechar={() => setSidebarAberta(false)}
      />

      <div className="dashboard-layout__main">
        <header className="dashboard-layout__topbar">
          <button
            className="dashboard-layout__menu-btn"
            type="button"
            aria-label="Abrir menu lateral"
            onClick={() => setSidebarAberta((v) => !v)}
          >
            ☰
          </button>

          <div className="dashboard-layout__search">
            <span aria-hidden="true">🔎</span>
            <input type="text" placeholder="Buscar morador, unidade, boleto..." />
          </div>

          <div className="dashboard-layout__topbar-actions">
            <button
              className="dashboard-layout__icon-btn"
              type="button"
              aria-label="Notificações"
            >
              🔔
              <span className="dashboard-layout__badge">3</span>
            </button>
            <span className="dashboard-layout__avatar" aria-hidden="true">
              CS
            </span>
          </div>
        </header>

        <div className="dashboard-layout__content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
