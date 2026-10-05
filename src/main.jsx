import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home/Home.jsx'
import DashboardLayout from './components/DashboardLayout/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Login from './pages/Auth/Login.jsx'
import Cadastro from './pages/Auth/Cadastro.jsx'
import Apartamentos from './pages/Cadastros/Apartamentos.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Site publico (com Toolbar) */}
        <Route element={<App />}>
          <Route index element={<Home />} />
        </Route>

        {/* Autenticacao (telas cheias, sem Toolbar) */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Area do Sindico (dashboard com menu lateral) */}
        <Route path="/area-do-sindico" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="cadastros/apartamentos" element={<Apartamentos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
