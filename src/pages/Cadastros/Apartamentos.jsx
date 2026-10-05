import { useEffect, useState } from 'react'
import Card from '../../components/Card/Card.jsx'
import TextField from '../../components/TextField/TextField.jsx'
import SelectField from '../../components/SelectField/SelectField.jsx'
import {
  ANDARES,
  ANDAR_LABEL,
  BLOCOS,
  BLOCO_LABEL,
  atualizarApartamento,
  criarApartamento,
  listarApartamentos,
  removerApartamento,
} from '../../services/apartamentoService.js'
import './cadastros.css'

const FORM_INICIAL = {
  numero: '',
  andar: '',
  bloco: '',
  qtdVagasGaragem: '',
  qtdQuartos: '',
  qtdSalas: '',
  qtdSuites: '',
}

const opcoesAndar = ANDARES.map((a) => ({ value: a, label: ANDAR_LABEL[a] }))
const opcoesBloco = BLOCOS.map((b) => ({ value: b, label: BLOCO_LABEL[b] }))

/**
 * Pagina de cadastro de Apartamentos (Cadastros > Apartamentos).
 * Lista os apartamentos existentes e permite cadastrar novos.
 */
function Apartamentos() {
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
      const dados = await listarApartamentos()
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
    if (form.numero === '') novos.numero = 'Informe o número.'
    if (!form.andar) novos.andar = 'Selecione o andar.'
    if (form.qtdVagasGaragem === '')
      novos.qtdVagasGaragem = 'Informe a quantidade de vagas.'
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
        const atualizado = await atualizarApartamento(editandoId, form)
        setLista((atual) =>
          atual.map((a) => (a.id === editandoId ? atualizado : a)),
        )
        setSucesso('Apartamento atualizado com sucesso!')
      } else {
        const novo = await criarApartamento(form)
        setLista((atual) => [...atual, novo])
        setSucesso('Apartamento cadastrado com sucesso!')
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
    await removerApartamento(id)
    setLista((atual) => atual.filter((a) => a.id !== id))
  }

  function handleVisualizar(apto) {
    setDetalhe(apto)
  }

  function handleEditar(apto) {
    // Carrega os dados no formulario e entra em modo de edicao.
    setForm({
      numero: String(apto.numero ?? ''),
      andar: apto.andar ?? '',
      bloco: apto.bloco ?? '',
      qtdVagasGaragem: String(apto.qtdVagasGaragem ?? ''),
      qtdQuartos: apto.qtdQuartos != null ? String(apto.qtdQuartos) : '',
      qtdSalas: apto.qtdSalas != null ? String(apto.qtdSalas) : '',
      qtdSuites: apto.qtdSuites != null ? String(apto.qtdSuites) : '',
    })
    setEditandoId(apto.id)
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
          <h1>Apartamentos</h1>
          <p>Cadastre e gerencie as unidades do condomínio.</p>
        </div>
      </header>

      <div className="cadastro-page__grid">
        {/* Formulario */}
        <Card titulo={editandoId ? 'Editar apartamento' : 'Novo apartamento'}>
          <form className="cadastro-form" onSubmit={handleSubmit} noValidate>
            {erroGeral && <div className="cadastro-form__erro">{erroGeral}</div>}
            {sucesso && <div className="cadastro-form__sucesso">{sucesso}</div>}

            <div className="cadastro-form__row">
              <TextField
                label="Número *"
                type="number"
                value={form.numero}
                onChange={atualizar('numero')}
                erro={erros.numero}
                placeholder="Ex: 302"
              />
              <SelectField
                label="Andar *"
                value={form.andar}
                onChange={atualizar('andar')}
                opcoes={opcoesAndar}
                erro={erros.andar}
                placeholder="Selecione..."
              />
            </div>

            <div className="cadastro-form__row">
              <SelectField
                label="Bloco"
                value={form.bloco}
                onChange={atualizar('bloco')}
                opcoes={opcoesBloco}
                placeholder="Sem bloco"
              />
              <TextField
                label="Vagas de garagem *"
                type="number"
                value={form.qtdVagasGaragem}
                onChange={atualizar('qtdVagasGaragem')}
                erro={erros.qtdVagasGaragem}
                placeholder="Ex: 1"
              />
            </div>

            <div className="cadastro-form__row cadastro-form__row--3">
              <TextField
                label="Quartos"
                type="number"
                value={form.qtdQuartos}
                onChange={atualizar('qtdQuartos')}
                placeholder="Ex: 3"
              />
              <TextField
                label="Salas"
                type="number"
                value={form.qtdSalas}
                onChange={atualizar('qtdSalas')}
                placeholder="Ex: 1"
              />
              <TextField
                label="Suítes"
                type="number"
                value={form.qtdSuites}
                onChange={atualizar('qtdSuites')}
                placeholder="Ex: 1"
              />
            </div>

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
                    : 'Cadastrar apartamento'}
              </button>
            </div>
          </form>
        </Card>

        {/* Listagem */}
        <Card titulo={`Apartamentos cadastrados (${lista.length})`}>
          {carregando ? (
            <p className="cadastro-lista__vazio">Carregando...</p>
          ) : lista.length === 0 ? (
            <p className="cadastro-lista__vazio">
              Nenhum apartamento cadastrado ainda.
            </p>
          ) : (
            <ul className="apto-lista">
              {lista.map((apto) => (
                <li className="apto-lista__item" key={apto.id}>
                  <div className="apto-lista__info">
                    <span className="apto-lista__icone" aria-hidden="true">
                      🚪
                    </span>
                    <div>
                      <small className="apto-lista__rotulo">Apartamento</small>
                      <strong className="apto-lista__numero">
                        {apto.numero}
                      </strong>
                    </div>
                  </div>

                  <div className="apto-lista__acoes">
                    <button
                      className="apto-btn apto-btn--ver"
                      type="button"
                      onClick={() => handleVisualizar(apto)}
                      aria-label={`Visualizar apartamento ${apto.numero}`}
                      title="Visualizar"
                    >
                      👁️
                    </button>
                    <button
                      className="apto-btn apto-btn--editar"
                      type="button"
                      onClick={() => handleEditar(apto)}
                      aria-label={`Editar apartamento ${apto.numero}`}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="apto-btn apto-btn--deletar"
                      type="button"
                      onClick={() => handleRemover(apto.id)}
                      aria-label={`Deletar apartamento ${apto.numero}`}
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
            aria-label={`Detalhes do apartamento ${detalhe.numero}`}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="apto-modal__head">
              <h3>Apartamento {detalhe.numero}</h3>
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
                <dt>Número</dt>
                <dd>{detalhe.numero}</dd>
              </div>
              <div>
                <dt>Andar</dt>
                <dd>{ANDAR_LABEL[detalhe.andar] || detalhe.andar}</dd>
              </div>
              <div>
                <dt>Bloco</dt>
                <dd>
                  {detalhe.bloco
                    ? BLOCO_LABEL[detalhe.bloco] || detalhe.bloco
                    : '—'}
                </dd>
              </div>
              <div>
                <dt>Vagas de garagem</dt>
                <dd>{detalhe.qtdVagasGaragem}</dd>
              </div>
              <div>
                <dt>Quartos</dt>
                <dd>{detalhe.qtdQuartos ?? '—'}</dd>
              </div>
              <div>
                <dt>Salas</dt>
                <dd>{detalhe.qtdSalas ?? '—'}</dd>
              </div>
              <div>
                <dt>Suítes</dt>
                <dd>{detalhe.qtdSuites ?? '—'}</dd>
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

export default Apartamentos
