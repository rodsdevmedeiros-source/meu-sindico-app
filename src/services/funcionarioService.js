/**
 * Service de Funcionarios.
 *
 * Fala apenas com o `apiClient` (camada central), nunca diretamente com
 * o localStorage. Para integrar com o backend, basta definir VITE_API_URL
 * (ver apiClient.js) — nenhuma pagina ou service precisa mudar.
 *
 * Modelo (espelha o body da API):
 * {
 *   id: string,
 *   nome: string,            // obrigatorio
 *   email: string,           // obrigatorio
 *   rg: string,              // obrigatorio
 *   telefoneContato: string, // obrigatorio
 *   atividade: Atividade,    // enum (STRING) obrigatorio
 *   dataCadastro: string     // ISO, preenchido pelo backend
 * }
 */

import { api } from './apiClient.js'

const RESOURCE = 'funcionarios'

/** Valores possiveis para o enum Atividade (STRING no backend). */
export const ATIVIDADES = [
  'PORTARIA',
  'LIMPEZA',
  'ZELADORIA',
  'SEGURANCA',
  'MANUTENCAO',
  'JARDINAGEM',
  'ADMINISTRACAO',
]

/** Rotulos amigaveis para exibicao do enum Atividade. */
export const ATIVIDADE_LABEL = {
  PORTARIA: 'Portaria',
  LIMPEZA: 'Limpeza',
  ZELADORIA: 'Zeladoria',
  SEGURANCA: 'Segurança',
  MANUTENCAO: 'Manutenção',
  JARDINAGEM: 'Jardinagem',
  ADMINISTRACAO: 'Administração',
}

/** Registros iniciais (seed) usados apenas no modo mock. */
const SEED = [
  {
    id: '7c1f0e2a-9d44-4b6e-8a1c-3f2b5d6e7a90',
    nome: 'Carlos Eduardo Silva',
    email: 'carlos.silva@email.com',
    rg: 'MG12345678',
    telefoneContato: '31999998888',
    atividade: 'PORTARIA',
    dataCadastro: '2026-10-05T13:49:00.223625',
  },
]

/** Opcoes extras repassadas ao apiClient (seed e ignorado no modo HTTP). */
const OPCOES = { seed: SEED }

/**
 * Monta o payload no formato esperado pelo backend, normalizando textos.
 * @param {object} dados dados crus vindos do formulario
 */
function montarPayload(dados) {
  const texto = (v) => (v ?? '').trim()

  return {
    nome: texto(dados.nome),
    email: texto(dados.email).toLowerCase(),
    rg: texto(dados.rg),
    telefoneContato: texto(dados.telefoneContato),
    atividade: dados.atividade,
  }
}

/**
 * Garante que nao exista outro funcionario com o mesmo e-mail ou RG.
 * @param {Array}  lista      funcionarios existentes
 * @param {object} payload    dados sendo gravados
 * @param {string} [ignoreId] id a ignorar (usado na edicao)
 */
function garantirUnico(lista, payload, ignoreId) {
  const emailDuplicado = lista.some(
    (f) => f.id !== ignoreId && f.email.toLowerCase() === payload.email,
  )
  if (emailDuplicado) {
    throw new Error('Já existe um funcionário com este e-mail.')
  }

  const rgDuplicado = lista.some(
    (f) => f.id !== ignoreId && f.rg === payload.rg,
  )
  if (rgDuplicado) {
    throw new Error('Já existe um funcionário com este RG.')
  }
}

/**
 * Lista todos os funcionarios.
 * @returns {Promise<Array>}
 */
export function listarFuncionarios() {
  return api.list(RESOURCE, OPCOES)
}

/**
 * Busca um funcionario pelo id.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export function buscarFuncionario(id) {
  return api.get(RESOURCE, id, OPCOES)
}

/**
 * Cria um novo funcionario.
 * @param {object} dados dados do formulario
 * @returns {Promise<object>}
 */
export async function criarFuncionario(dados) {
  const payload = montarPayload(dados)
  const existentes = await api.list(RESOURCE, OPCOES)
  garantirUnico(existentes, payload)
  return api.create(RESOURCE, payload, OPCOES)
}

/**
 * Atualiza um funcionario existente.
 * @param {string} id    id do funcionario
 * @param {object} dados dados do formulario
 * @returns {Promise<object>}
 */
export async function atualizarFuncionario(id, dados) {
  const payload = montarPayload(dados)
  const existentes = await api.list(RESOURCE, OPCOES)
  garantirUnico(existentes, payload, id)
  return api.update(RESOURCE, id, payload, OPCOES)
}

/**
 * Remove um funcionario pelo id.
 * @param {string} id
 * @returns {Promise<void>}
 */
export function removerFuncionario(id) {
  return api.remove(RESOURCE, id, OPCOES)
}
