import { Outlet } from 'react-router-dom'
import Toolbar from './components/Toolbar/Toolbar.jsx'
import './App.css'

/**
 * Layout raiz da aplicacao.
 * Mantem a Toolbar fixa no topo e renderiza a pagina ativa via <Outlet />.
 */
function App() {
  return (
    <div className="app-shell">
      <Toolbar />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
