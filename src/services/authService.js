/**
 * Service de autenticacao MOCKADO.
 *
 * Simula uma API de login/cadastro persistindo os usuarios no
 * localStorage do navegador. Todas as funcoes retornam Promises e
 * aplicam um pequeno atraso artificial para imitar uma chamada de rede.
 *
 * Em producao, basta trocar a implementacao destas funcoes por chamadas
 * HTTP reais mantendo a mesma assinatura.
 */

const STORAGE_USERS = 'msa:usuarios'
const STORAGE_SESSION = 'msa:sessao'

/** Gera um UUID v4 (usa a API nativa quando disponivel). */
function gerarId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** Simula latencia de rede. */
function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Le a lista de usuarios do localStorage. */
function lerUsuarios() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Grava a lista de usuarios no localStorage. */
function salvarUsuarios(usuarios) {
  localStorage.setItem(STORAGE_USERS, JSON.stringify(usuarios))
}

/** Remove a senha antes de expor o usuario para a aplicacao. */
function semSenha(usuario) {
  const { senha, ...publico } = usuario
  return publico
}

/**
 * Cadastra um novo usuario.
 * @param {{ nome: string, email: string, senha: string }} dados
 * @returns {Promise<{id,nome,email,role}>}
 */
export async function cadastrar({ nome, email, senha }) {
  await delay()
  const usuarios = lerUsuarios()

  const jaExiste = usuarios.some(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
  )
  if (jaExiste) {
    throw new Error('Já existe uma conta com este e-mail.')
  }

  const novo = {
    id: gerarId(),
    nome: nome.trim(),
    email: email.trim().toLowerCase(),
    senha, // apenas no mock; nunca armazene senha em texto puro em producao
    role: 'USUARIO',
  }

  usuarios.push(novo)
  salvarUsuarios(usuarios)

  return semSenha(novo)
}

/**
 * Autentica um usuario por email/usuario + senha.
 * O campo `identificador` aceita o email do usuario.
 * @param {{ identificador: string, senha: string }} dados
 * @returns {Promise<{id,nome,email,role}>}
 */
export async function login({ identificador, senha }) {
  await delay()
  const usuarios = lerUsuarios()
  const alvo = identificador.trim().toLowerCase()

  const usuario = usuarios.find(
    (u) => u.email.toLowerCase() === alvo || u.nome.toLowerCase() === alvo,
  )

  if (!usuario || usuario.senha !== senha) {
    throw new Error('Usuário ou senha inválidos.')
  }

  const publico = semSenha(usuario)
  localStorage.setItem(STORAGE_SESSION, JSON.stringify(publico))
  return publico
}

/** Retorna o usuario logado (ou null). */
export function usuarioAtual() {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Encerra a sessao atual. */
export function logout() {
  localStorage.removeItem(STORAGE_SESSION)
}
