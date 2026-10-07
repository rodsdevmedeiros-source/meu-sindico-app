import { useEffect, useState } from 'react'
import Card from '../../components/Card/Card.jsx'
import TextField from '../../components/TextField/TextField.jsx'
import SelectField from '../../components/SelectField/SelectField.jsx'
import {
  ATIVIDADES,
  ATIVIDADE_LABEL,
  atualizarFuncionario,
  criarFuncionario,
  listarFuncionarios,
  removerFuncionario,
} from '../../services/funcionarioService.js'
import { emailValido } from '../../utils/validators.js'
import './cadastros.css'

const FORM_INICIAL = {
  nome: '',
  email: '',
  rg: '',
  telefoneContato: '',
  atividade: '',
}

const opcoesAtividade = ATIVIDADES.map((a) => ({
  value: a,
  label: ATIVIDADE_LABEL[a],
}))

/**
 * Pagina de cadastro de Funcionarios (Cadastros > Funcionarios).
 * Lista os funcionarios (apenas o nome) e permite criar, visualizar,
 * editar e remover. Mesmo padrao do cadastro de Apartamentos.
 */
function Funcionarios() {
  const [lista, setLista] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [form, setForm] = useState(FORM_INICIAL)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [detalhe, setDetalhe] = useState(null)
  const [editandoId, setEditandoId] = useState(null) // null = modo criacao

  async function carregar() {
    setCarregando(true)
    try {
      const dados = await listarFuncionarios()
      setLista(dados)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  function atualizar(campo) {
    return (e) => {
      setForm((f) => ({ ...f, [campo]: e.target.value }))
      setErros((prev) => ({ ...prev, [campo]: undefined }))
      setErroGeral('')
      setSucesso('')
    }
  }

  function validar() {
    const novos = {}
    if (!form.nome.trim()) novos.nome = 'Informe o nome.'
    if (!form.email.trim()) {
      novos.email = 'Informe o e-mail.'
    } else if (!emailValido(form.email)) {
      novos.email = 'E-mail inválido.'
    }
    if (!form.rg.trim()) novos.rg = 'Informe o RG.'
    if (!form.telefoneContato.trim())
      novos.telefoneContato = 'Informe o telefone.'
    if (!form.atividade) novos.atividade = 'Selecione a atividade.'
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSucesso('')
    setErroGeral('')
    if (!validar()) return

    setSalvando(true)
    try {
      if (editandoId) {
        const atualizado = await atualizarFuncionario(editandoId, form)
        setLista((atual) =>
          atual.map((f) => (f.id === editandoId ? atualizado : f)),
        )
        setSucesso('Funcionário atualizado com sucesso!')
      } else {
        const novo = await criarFuncionario(form)
        setLista((atual) => [...atual, novo])
        setSucesso('Funcionário cadastrado com sucesso!')
      }
      setForm(FORM_INICIAL)
      setEditandoId(null)
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setSalvando(false)
    }
  }

  function cancelarEdicao() {
    setForm(FORM_INICIAL)
    setEditandoId(null)
    setErros({})
    setErroGeral('')
    setSucesso('')
  }

  async function handleRemover(id) {
    await removerFuncionario(id)
    setLista((atual) => atual.filter((f) => f.id !== id))
  }

  function handleVisualizar(func) {
    setDetalhe(func)
  }

  function handleEditar(func) {
    setForm({
      nome: func.nome ?? '',
      email: func.email ?? '',
      rg: func.rg ?? '',
      telefoneContato: func.telefoneContato ?? '',
      atividade: func.atividade ?? '',
    })
    setEditandoId(func.id)
    setErros({})
    setErroGeral('')
    setSucesso('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="cadastro-page">
      <header className="cadastro-page__header">
        <div>
          <span className="cadastro-page__breadcrumb">Cadastros</span>
          <h1>Funcionários</h1>
          <p>Cadastre e gerencie a equipe do condomínio.</p>
        </div>
      </header>

      <div className="cadastro-page__grid">
        {/* Formulario */}
        <Card titulo={editandoId ? 'Editar funcionário' : 'Novo funcionário'}>
          <form className="cadastro-form" onSubmit={handleSubmit} noValidate>
            {erroGeral && <div className="cadastro-form__erro">{erroGeral}</div>}
            {sucesso && <div className="cadastro-form__sucesso">{sucesso}</div>}

            <TextField
              label="Nome *"
              value={form.nome}
              onChange={atualizar('nome')}
              erro={erros.nome}
              placeholder="Ex: Carlos Eduardo Silva"
            />

            <TextField
              label="E-mail *"
              type="email"
              value={form.email}
              onChange={atualizar('email')}
              erro={erros.email}
              placeholder="Ex: carlos.silva@email.com"
            />

            <div className="cadastro-form__row">
              <TextField
                label="RG *"
                value={form.rg}
                onChange={atualizar('rg')}
                erro={erros.rg}
                placeholder="Ex: MG12345678"
              />
              <TextField
                label="Telefone *"
                value={form.telefoneContato}
                onChange={atualizar('telefoneContato')}
                erro={erros.telefoneContato}
                placeholder="Ex: 31999998888"
              />
            </div>

            <SelectField
              label="Atividade *"
              value={form.atividade}
              onChange={atualizar('atividade')}
              opcoes={opcoesAtividade}
              erro={erros.atividade}
              placeholder="Selecione..."
            />

            <div className="cadastro-form__acoes">
              {editandoId && (
                <button
                  className="cadastro-form__cancelar"
                  type="button"
                  onClick={cancelarEdicao}
                  disabled={salvando}
                >
                  Cancelar
                </button>
              )}
              <button
                className="cadastro-form__submit"
                type="submit"
                disabled={salvando}
              >
                {salvando
                  ? 'Salvando...'
                  : editandoId
                    ? 'Salvar alterações'
                    : 'Cadastrar funcionário'}
              </button>
            </div>
          </form>
        </Card>

        {/* Listagem */}
        <Card titulo={`Funcionários cadastrados (${lista.length})`}>
          {carregando ? (
            <p className="cadastro-lista__vazio">Carregando...</p>
          ) : lista.length === 0 ? (
            <p className="cadastro-lista__vazio">
              Nenhum funcionário cadastrado ainda.
            </p>
          ) : (
            <ul className="apto-lista">
              {lista.map((func) => (
                <li className="apto-lista__item" key={func.id}>
                  <div className="apto-lista__info">
                    <span className="apto-lista__icone" aria-hidden="true">
                      👷
                    </span>
                    <div>
                      <small className="apto-lista__rotulo">Funcionário</small>
                      <strong className="apto-lista__numero">
                        {func.nome}
                      </strong>
                    </div>
                  </div>

                  <div className="apto-lista__acoes">
                    <button
                      className="apto-btn apto-btn--ver"
                      type="button"
                      onClick={() => handleVisualizar(func)}
                      aria-label={`Visualizar ${func.nome}`}
                      title="Visualizar"
                    >
                      👁️
                    </button>
                    <button
                      className="apto-btn apto-btn--editar"
                      type="button"
                      onClick={() => handleEditar(func)}
                      aria-label={`Editar ${func.nome}`}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="apto-btn apto-btn--deletar"
                      type="button"
                      onClick={() => handleRemover(func.id)}
                      aria-label={`Deletar ${func.nome}`}
                      title="Deletar"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Modal de visualizacao */}
      {detalhe && (
        <div
          className="apto-modal__overlay"
          onClick={() => setDetalhe(null)}
          role="presentation"
        >
          <div
            className="apto-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${detalhe.nome}`}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="apto-modal__head">
              <h3>{detalhe.nome}</h3>
              <button
                className="apto-modal__fechar"
                type="button"
                onClick={() => setDetalhe(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </header>

            <dl className="apto-modal__dados">
              <div>
                <dt>Nome</dt>
                <dd>{detalhe.nome}</dd>
              </div>
              <div>
                <dt>Atividade</dt>
                <dd>{ATIVIDADE_LABEL[detalhe.atividade] || detalhe.atividade}</dd>
              </div>
              <div>
                <dt>E-mail</dt>
                <dd>{detalhe.email}</dd>
              </div>
              <div>
                <dt>Telefone</dt>
                <dd>{detalhe.telefoneContato}</dd>
              </div>
              <div>
                <dt>RG</dt>
                <dd>{detalhe.rg}</dd>
              </div>
              <div>
                <dt>Cadastrado em</dt>
                <dd>
                  {detalhe.dataCadastro
                    ? new Date(detalhe.dataCadastro).toLocaleString('pt-BR')
                    : '—'}
                </dd>
              </div>
            </dl>

            <footer className="apto-modal__footer">
              <button
                className="apto-modal__btn"
                type="button"
                onClick={() => {
                  handleEditar(detalhe)
                  setDetalhe(null)
                }}
              >
                Editar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  )
}

export default Funcionarios
