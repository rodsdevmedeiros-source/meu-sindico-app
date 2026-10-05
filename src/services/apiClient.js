/**
 * Camada central de acesso a dados.
 *
 * Hoje opera em MODO MOCK, persistindo colecoes no localStorage e
 * simulando latencia de rede. Cada metodo tem a semantica de um verbo
 * REST (GET/POST/PUT/DELETE) sobre um "resource" (ex: 'apartamentos').
 *
 * ------------------------------------------------------------------
 * COMO INTEGRAR COM O BACKEND DEPOIS (sem alterar os services/paginas):
 *   1. Defina a variavel de ambiente VITE_API_URL (ex: no .env):
 *        VITE_API_URL=http://localhost:8080/api
 *   2. O cliente passa a usar `fetch` automaticamente nos metodos reais
 *      (ver bloco "MODO HTTP" abaixo). As assinaturas sao identicas,
 *      entao os services e componentes continuam iguais.
 * ------------------------------------------------------------------
 */

const API_URL = import.meta.env.VITE_API_URL
const USAR_MOCK = !API_URL

/** Simula latencia de rede (apenas no modo mock). */
function delay(ms = 450) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Gera um UUID v4 (usa a API nativa quando disponivel). */
export function gerarId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/* ============================= MODO MOCK ============================= */

function chaveStorage(resource) {
  return `msa:${resource}`
}

function lerColecao(resource, seed = []) {
  try {
    const raw = localStorage.getItem(chaveStorage(resource))
    if (raw === null) {
      localStorage.setItem(chaveStorage(resource), JSON.stringify(seed))
      return [...seed]
    }
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function salvarColecao(resource, lista) {
  localStorage.setItem(chaveStorage(resource), JSON.stringify(lista))
}

const mock = {
  async list(resource, { seed } = {}) {
    await delay()
    return lerColecao(resource, seed)
  },

  async get(resource, id, { seed } = {}) {
    await delay(300)
    return lerColecao(resource, seed).find((item) => item.id === id) || null
  },

  async create(resource, payload, { seed } = {}) {
    await delay()
    const lista = lerColecao(resource, seed)
    const novo = {
      id: gerarId(),
      ...payload,
      dataCadastro: new Date().toISOString(),
    }
    lista.push(novo)
    salvarColecao(resource, lista)
    return novo
  },

  async update(resource, id, payload, { seed } = {}) {
    await delay()
    const lista = lerColecao(resource, seed)
    const indice = lista.findIndex((item) => item.id === id)
    if (indice === -1) {
      throw new Error('Registro não encontrado.')
    }
    const atualizado = { ...lista[indice], ...payload, id }
    lista[indice] = atualizado
    salvarColecao(resource, lista)
    return atualizado
  },

  async remove(resource, id, { seed } = {}) {
    await delay(300)
    const lista = lerColecao(resource, seed).filter((item) => item.id !== id)
    salvarColecao(resource, lista)
  },
}

/* ============================= MODO HTTP ============================= */

async function requisicao(metodo, caminho, corpo) {
  const resposta = await fetch(`${API_URL}${caminho}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined,
  })

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status}`
    try {
      const erro = await resposta.json()
      mensagem = erro.message || erro.erro || mensagem
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new Error(mensagem)
  }

  if (resposta.status === 204) return null
  return resposta.json()
}

const http = {
  list: (resource) => requisicao('GET', `/${resource}`),
  get: (resource, id) => requisicao('GET', `/${resource}/${id}`),
  create: (resource, payload) => requisicao('POST', `/${resource}`, payload),
  update: (resource, id, payload) =>
    requisicao('PUT', `/${resource}/${id}`, payload),
  remove: (resource, id) => requisicao('DELETE', `/${resource}/${id}`),
}

/**
 * Cliente de API exposto para os services.
 * Alterna entre mock e HTTP conforme a existencia de VITE_API_URL.
 */
export const api = USAR_MOCK ? mock : http

export const EM_MODO_MOCK = USAR_MOCK
