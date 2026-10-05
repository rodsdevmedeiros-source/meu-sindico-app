import { useEffect, useState } from 'react'
import Card from '../../components/Card/Card.jsx'
import TextField from '../../components/TextField/TextField.jsx'
import SelectField from '../../components/SelectField/SelectField.jsx'
import {
  ANDARES,
  ANDAR_LABEL,
  BLOCOS,
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
const opcoesBloco = BLOCOS.map((b) => ({ value: b, label: `Bloco ${b}` }))

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
      const novo = await criarApartamento(form)
      setLista((atual) => [...atual, novo])
      setForm(FORM_INICIAL)
      setSucesso('Apartamento cadastrado com sucesso!')
    } catch (err) {
      setErroGeral(err.message)
    } finally {
      setSalvando(false)
    }
  }

  async function handleRemover(id) {
    await removerApartamento(id)
    setLista((atual) => atual.filter((a) => a.id !== id))
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
        <Card titulo="Novo apartamento">
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

            <button
              className="cadastro-form__submit"
              type="submit"
              disabled={salvando}
            >
              {salvando ? 'Salvando...' : 'Cadastrar apartamento'}
            </button>
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
            <div className="cadastro-tabela-wrap">
              <table className="cadastro-tabela">
                <thead>
                  <tr>
                    <th>Unidade</th>
                    <th>Andar</th>
                    <th>Garagem</th>
                    <th>Quartos</th>
                    <th>Suítes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((apto) => (
                    <tr key={apto.id}>
                      <td>
                        <strong>
                          {apto.numero}
                          {apto.bloco ? ` · Bloco ${apto.bloco}` : ''}
                        </strong>
                      </td>
                      <td>{ANDAR_LABEL[apto.andar] || apto.andar}</td>
                      <td>{apto.qtdVagasGaragem}</td>
                      <td>{apto.qtdQuartos ?? '-'}</td>
                      <td>{apto.qtdSuites ?? '-'}</td>
                      <td>
                        <button
                          className="cadastro-tabela__remover"
                          type="button"
                          onClick={() => handleRemover(apto.id)}
                          aria-label="Remover apartamento"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Apartamentos
