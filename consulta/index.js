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
  }
}

app.get('/avistamentos', (req, res) => {
  res.json(baseConsulta)
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