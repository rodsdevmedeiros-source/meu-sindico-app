/**
 * Funcoes de validacao reutilizaveis para formularios.
 */

/**
 * Valida um endereco de email.
 * @param {string} email
 * @returns {boolean}
 */
export function emailValido(email) {
  if (!email) return false
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email.trim())
}

/**
 * Regras de senha: minimo 6 caracteres, ao menos 1 letra maiuscula
 * e ao menos 1 caractere especial.
 * @param {string} senha
 * @returns {{ valida: boolean, erros: string[] }}
 */
export function validarSenha(senha) {
  const erros = []
  const valor = senha ?? ''

  if (valor.length < 6) {
    erros.push('Mínimo de 6 caracteres')
  }
  if (!/[A-Z]/.test(valor)) {
    erros.push('Ao menos 1 letra maiúscula')
  }
  if (!/[!@#$%^&*(),.?":{}|<>[\]\\/;'`~_+\-=]/.test(valor)) {
    erros.push('Ao menos 1 caractere especial')
  }

  return { valida: erros.length === 0, erros }
}

/**
 * Valida se um campo de texto obrigatorio foi preenchido.
 * @param {string} valor
 * @returns {boolean}
 */
export function campoPreenchido(valor) {
  return Boolean(valor && valor.trim().length > 0)
}
