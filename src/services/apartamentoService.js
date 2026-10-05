/**
 * Service de Apartamentos (MOCKADO).
 *
 * Persiste os apartamentos no localStorage e simula latencia de rede.
 * As assinaturas espelham um CRUD de API para facilitar a troca por
 * chamadas HTTP reais no futuro.
 *
 * Modelo (espelha a entidade do backend):
 * {
 *   id: string,
 *   qtdVagasGaragem: number,  // obrigatorio
 *   andar: Andar,             // enum (STRING) obrigatorio
 *   numero: number,           // obrigatorio
 *   bloco: Bloco,             // enum (STRING) opcional
 *   qtdQuartos: number,       // opcional
 *   qtdSalas: number,         // opcional
 *   qtdSuites: number         // opcional
 * }
 */

const STORAGE_KEY = 'msa:apartamentos'

/** Valores possiveis para o enum Andar (STRING no backend). */
export const ANDARES = [
  'TERREO',
  'PRIMEIRO',
  'SEGUNDO',
  'TERCEIRO',
  'QUARTO',
  'QUINTO',
  'SEXTO',
  'SETIMO',
  'OITAVO',
  'NONO',
  'DECIMO',
  'COBERTURA',
]

/** Rotulos amigaveis para exibicao do enum Andar. */
export const ANDAR_LABEL = {
  TERREO: 'Térreo',
  PRIMEIRO: '1º andar',
  SEGUNDO: '2º andar',
  TERCEIRO: '3º andar',
  QUARTO: '4º andar',
  QUINTO: '5º andar',
  SEXTO: '6º andar',
  SETIMO: '7º andar',
  OITAVO: '8º andar',
  NONO: '9º andar',
  DECIMO: '10º andar',
  COBERTURA: 'Cobertura',
}

/** Valores possiveis para o enum Bloco (STRING no backend). */
export const BLOCOS = ['A', 'B', 'C', 'D', 'E', 'F']

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
function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Le a lista de apartamentos do localStorage. */
function ler() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Grava a lista de apartamentos no localStorage. */
function salvar(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista))
}

/** Converte os campos numericos vindos do formulario. */
function normalizar(dados) {
  const paraInt = (v) =>
    v === '' || v === null || v === undefined ? null : Number(v)

  return {
    qtdVagasGaragem: paraInt(dados.qtdVagasGaragem),
    andar: dados.andar,
    numero: paraInt(dados.numero),
    bloco: dados.bloco || null,
    qtdQuartos: paraInt(dados.qtdQuartos),
    qtdSalas: paraInt(dados.qtdSalas),
    qtdSuites: paraInt(dados.qtdSuites),
  }
}

/**
 * Lista todos os apartamentos cadastrados.
 * @returns {Promise<Array>}
 */
export async function listarApartamentos() {
  await delay()
  return ler()
}

/**
 * Cria um novo apartamento.
 * @param {object} dados
 * @returns {Promise<object>}
 */
export async function criarApartamento(dados) {
  await delay()
  const lista = ler()
  const normalizado = normalizar(dados)

  const duplicado = lista.some(
    (a) => a.numero === normalizado.numero && a.bloco === normalizado.bloco,
  )
  if (duplicado) {
    throw new Error('Já existe um apartamento com este número e bloco.')
  }

  const novo = { id: gerarId(), ...normalizado }
  lista.push(novo)
  salvar(lista)
  return novo
}

/**
 * Remove um apartamento pelo id.
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function removerApartamento(id) {
  await delay(300)
  const lista = ler().filter((a) => a.id !== id)
  salvar(lista)
}
