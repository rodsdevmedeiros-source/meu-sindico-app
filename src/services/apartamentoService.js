/**
 * Service de Apartamentos.
 *
 * Fala apenas com o `apiClient` (camada central), nunca diretamente com
 * o localStorage. Isso permite trocar o mock pelo backend real sem
 * alterar as paginas: basta definir VITE_API_URL (ver apiClient.js).
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
 *   qtdSuites: number,        // opcional
 *   dataCadastro: string      // ISO, preenchido pelo backend
 * }
 */

import { api } from './apiClient.js'

const RESOURCE = 'apartamentos'

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
export const BLOCOS = ['BLOCO_A', 'BLOCO_B', 'BLOCO_C', 'BLOCO_D', 'BLOCO_E', 'BLOCO_F']

/** Rotulos amigaveis para exibicao do enum Bloco. */
export const BLOCO_LABEL = {
  BLOCO_A: 'Bloco A',
  BLOCO_B: 'Bloco B',
  BLOCO_C: 'Bloco C',
  BLOCO_D: 'Bloco D',
  BLOCO_E: 'Bloco E',
  BLOCO_F: 'Bloco F',
}

/** Registros iniciais (seed) usados apenas no modo mock. */
const SEED = [
  {
    id: 'e8ec296a-bd51-47de-a5ff-e2d6195f7d92',
    qtdVagasGaragem: 2,
    andar: 'PRIMEIRO',
    numero: 101,
    bloco: 'BLOCO_A',
    qtdQuartos: 3,
    qtdSalas: 1,
    qtdSuites: 1,
    dataCadastro: '2026-10-05T13:49:00.223625',
  },
]

/** Opcoes extras repassadas ao apiClient (seed e ignorado no modo HTTP). */
const OPCOES = { seed: SEED }

/**
 * Monta o payload no formato esperado pelo backend, convertendo os
 * campos numericos e normalizando os opcionais vazios para null.
 * @param {object} dados dados crus vindos do formulario
 */
function montarPayload(dados) {
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
 * Garante que nao exista outro apartamento com mesmo numero + bloco.
 * @param {Array}  lista     apartamentos existentes
 * @param {object} payload   dados sendo gravados
 * @param {string} [ignoreId] id a ignorar (usado na edicao)
 */
function garantirUnico(lista, payload, ignoreId) {
  const duplicado = lista.some(
    (a) =>
      a.id !== ignoreId &&
      a.numero === payload.numero &&
      a.bloco === payload.bloco,
  )
  if (duplicado) {
    throw new Error('Já existe um apartamento com este número e bloco.')
  }
}

/**
 * Lista todos os apartamentos.
 * @returns {Promise<Array>}
 */
export function listarApartamentos() {
  return api.list(RESOURCE, OPCOES)
}

/**
 * Busca um apartamento pelo id.
 * @param {string} id
 * @returns {Promise<object|null>}
 */
export function buscarApartamento(id) {
  return api.get(RESOURCE, id, OPCOES)
}

/**
 * Cria um novo apartamento.
 * @param {object} dados dados do formulario
 * @returns {Promise<object>}
 */
export async function criarApartamento(dados) {
  const payload = montarPayload(dados)
  const existentes = await api.list(RESOURCE, OPCOES)
  garantirUnico(existentes, payload)
  return api.create(RESOURCE, payload, OPCOES)
}

/**
 * Atualiza um apartamento existente.
 * @param {string} id    id do apartamento
 * @param {object} dados dados do formulario
 * @returns {Promise<object>}
 */
export async function atualizarApartamento(id, dados) {
  const payload = montarPayload(dados)
  const existentes = await api.list(RESOURCE, OPCOES)
  garantirUnico(existentes, payload, id)
  return api.update(RESOURCE, id, payload, OPCOES)
}

/**
 * Remove um apartamento pelo id.
 * @param {string} id
 * @returns {Promise<void>}
 */
export function removerApartamento(id) {
  return api.remove(RESOURCE, id, OPCOES)
}
