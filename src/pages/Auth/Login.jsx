import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TextField from '../../components/TextField/TextField.jsx'
import { login } from '../../services/authService.js'
import { campoPreenchido } from '../../utils/validators.js'
import './auth.css'

/**
 * Tela de login (mockada).
 * Aceita email ou nome de usuario + senha.
 */
function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ identificador: '', senha: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  function atualizar(campo) {
    return (e) => {
      setForm((f) => ({ ...f, [campo]: e.target.value }))
      setErros((prev) => ({ ...prev, [campo]: undefined }))
      setErroGeral('')
    }
  }

  function validar() {
    const novos = {}
    if (!campoPreenchido(form.identificador)) {
      novos.identificador = 'Informe seu usuário ou e-mail.'
    }
    if (!campoPreenchido(form.senha)) {
      novos.senha = 'Informe sua senha.'
    }
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validar()) return

    setEnviando(true)
    setErroGeral('')
    try {
      await login(form)
      navigate('/area-do-sindico')
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth">
      <aside className="auth__aside">
        <Link to="/" className="auth__aside-logo">
          <span aria-hidden="true">🏢</span> Meu Síndico App
        </Link>
        <h2>Gestão condominial simples e organizada</h2>
        <p>
          Acesse o painel para acompanhar finanças, moradores, reservas e
          comunicados do seu condomínio.
        </p>
        <span className="auth__aside-building" aria-hidden="true">
          🏢
        </span>
      </aside>

      <section className="auth__panel">
        <div className="auth__form-wrap">
          <Link className="auth__voltar" to="/">
            ← Voltar para a home
          </Link>
          <h1 className="auth__title">Entrar</h1>
          <p className="auth__subtitle">
            Bem-vindo de volta. Informe seus dados para acessar.
          </p>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {erroGeral && <div className="auth__erro-geral">{erroGeral}</div>}

            <TextField
              label="Usuário ou e-mail"
              value={form.identificador}
              onChange={atualizar('identificador')}
              erro={erros.identificador}
              placeholder="seu@email.com"
              autoComplete="username"
            />

            <TextField
              label="Senha"
              type="password"
              value={form.senha}
              onChange={atualizar('senha')}
              erro={erros.senha}
              placeholder="Sua senha"
              autoComplete="current-password"
            />

            <button className="auth__submit" type="submit" disabled={enviando}>
              {enviando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="auth__rodape">
            Não tem cadastro?{' '}
            <Link className="auth__link" to="/cadastro">
              Criar conta
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Login
