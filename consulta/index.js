const express = require('express')
const app = express()
app.use(express.json())

const baseConsulta = {}

const funcoes = {
  AvistamentoCriado: (avistamento) => {
    avistamento.relatos = []
    baseConsulta[avistamento.id] = avistamento
  },
  RelatoCriado: (relato) => {
    const avistamento = baseConsulta[relato.avistamentoId]
    if (avistamento) {
      avistamento.relatos.push(relato)
    }
  },
  RelatoConfirmado: (confirmacao) => {
    const avistamento = baseConsulta[confirmacao.avistamentoId]
    if(avistamento) {
      const relato = avistamento.relatos.find((r) => r.id === confirmacao.id)
      if (relato) {
        relato.confirmacoes = confirmacao.confirmacoes
      }
    }
  }
}

app.get('/avistamentos', (req, res) => {
  res.json(baseConsulta)
})

app.get('/avistamentos/:id', (req, res)=> {
  const avistamento = baseConsulta[req.params.id]
  if(!avistamento){
    return res.status(404).json({erro: 'avistamento não encontrado'})
  }
  res.json(avistamento)
})

app.post('/eventos', (req, res) => {
  const { tipo, dados } = req.body || {}
  if (funcoes[tipo]) {
    funcoes[tipo](dados)
  }
  res.status(200).json({ msg: 'ok' })
})

const port = 4200
app.listen(port, () => console.log(`Consulta. Porta ${port}`))