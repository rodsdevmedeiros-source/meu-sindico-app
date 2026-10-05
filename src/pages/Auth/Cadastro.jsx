import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TextField from '../../components/TextField/TextField.jsx'
import { cadastrar } from '../../services/authService.js'
import {
  campoPreenchido,
  emailValido,
  validarSenha,
} from '../../utils/validators.js'
import './auth.css'

/**
 * Tela de cadastro (mockada).
 * Coleta nome, e-mail e senha, com validacao de e-mail e de senha
 * (minimo 6 caracteres, 1 maiuscula e 1 caractere especial).
 */
function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Checklist de requisitos de senha em tempo real
  const reqSenha = useMemo(() => {
    const s = form.senha
    return {
      tamanho: s.length >= 6,
      maiuscula: /[A-Z]/.test(s),
      especial: /[!@#$%^&*(),.?":{}|<>[\]\\/;'`~_+\-=]/.test(s),
    }
  }, [form.senha])

  function atualizar(campo) {
    return (e) => {
      setForm((f) => ({ ...f, [campo]: e.target.value }))
      setErros((prev) => ({ ...prev, [campo]: undefined }))
      setErroGeral('')
    }
  }

  function validar() {
    const novos = {}

    if (!campoPreenchido(form.nome)) {
      novos.nome = 'Informe seu nome.'
    }
    if (!campoPreenchido(form.email)) {
      novos.email = 'Informe seu e-mail.'
    } else if (!emailValido(form.email)) {
      novos.email = 'E-mail inválido.'
    }

    const { valida, erros: errosSenha } = validarSenha(form.senha)
    if (!valida) {
      novos.senha = errosSenha.join(' • ')
    }

    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSucesso('')
    if (!validar()) return

    setEnviando(true)
    setErroGeral('')
    try {
      const usuario = await cadastrar(form)
      setSucesso(
        `Conta criada para ${usuario.nome}! Redirecionando para o login...`,
      )
      setTimeout(() => navigate('/login'), 1200)
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
        <h2>Crie sua conta e simplifique a gestão</h2>
        <p>
          Em poucos minutos você centraliza moradores, finanças e comunicados
          do seu condomínio em um só lugar.
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
          <h1 className="auth__title">Criar conta</h1>
          <p className="auth__subtitle">Preencha os dados para começar.</p>

          <form className="auth__form" onSubmit={handleSubmit} noValidate>
            {erroGeral && <div className="auth__erro-geral">{erroGeral}</div>}
            {sucesso && <div className="auth__sucesso">{sucesso}</div>}

            <TextField
              label="Nome"
              value={form.nome}
              onChange={atualizar('nome')}
              erro={erros.nome}
              placeholder="Seu nome completo"
              autoComplete="name"
            />

            <TextField
              label="E-mail"
              type="email"
              value={form.email}
              onChange={atualizar('email')}
              erro={erros.email}
              placeholder="seu@email.com"
              autoComplete="email"
            />

            <div>
              <TextField
                label="Senha"
                type="password"
                value={form.senha}
                onChange={atualizar('senha')}
                erro={erros.senha}
                placeholder="Crie uma senha"
                autoComplete="new-password"
              />
              <ul className="auth__requisitos">
                <li
                  className={`auth__requisito ${reqSenha.tamanho ? 'auth__requisito--ok' : ''}`}
                >
                  {reqSenha.tamanho ? '✓' : '○'} Mínimo de 6 caracteres
                </li>
                <li
                  className={`auth__requisito ${reqSenha.maiuscula ? 'auth__requisito--ok' : ''}`}
                >
                  {reqSenha.maiuscula ? '✓' : '○'} Ao menos 1 letra maiúscula
                </li>
                <li
                  className={`auth__requisito ${reqSenha.especial ? 'auth__requisito--ok' : ''}`}
                >
                  {reqSenha.especial ? '✓' : '○'} Ao menos 1 caractere especial
                </li>
              </ul>
            </div>

            <button className="auth__submit" type="submit" disabled={enviando}>
              {enviando ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </form>

          <p className="auth__rodape">
            Já tem conta?{' '}
            <Link className="auth__link" to="/login">
              Entrar
            </Link>
          </p>
        </div>
      </section>
    </div>
  )
}

export default Cadastro
