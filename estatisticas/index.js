const express = require('express')
const app = express()
app.use(express.json())

const totais = { avistamentos: 0, relatos: 0, confirmacoes: 0 }
const locais = {}
const localPorAvistamentoId = {}
const ordemDosLocais = []

const funcoes = {
  AvistamentoCriado: (avistamento) => {
    localPorAvistamentoId[avistamento.id] = avistamento.local
    if (!locais[avistamento.local]) {
      locais[avistamento.local] = { avistamentos: 0, relatos: 0, confirmacoes: 0 }
      ordemDosLocais.push(avistamento.local)
    }
    locais[avistamento.local].avistamentos++
    totais.avistamentos++
  },
  RelatoCriado: (relato) => {
    const local = localPorAvistamentoId[relato.avistamentoId]
    if (local) {
      locais[local].relatos++
      totais.relatos++
    }
  },
  RelatoConfirmado: (confirmacao) => {
    const local = localPorAvistamentoId[confirmacao.avistamentoId]
    if (local) {
      locais[local].confirmacoes++
      totais.confirmacoes++
    }
  }
}

app.get('/estatisticas', (req, res) => {
  res.json({ totais, locais })
})

app.get('/estatisticas/destaque', (req, res) => {
  let destaque = null
  let engajamento = 0
  for (const nome of ordemDosLocais) {
    const total = locais[nome].relatos + locais[nome].confirmacoes
    if (destaque === null || total > engajamento) {
      destaque = nome
      engajamento = total
    }
  }
  if (destaque === null) {
    return res.status(404).json({ erro: 'sem dados' })
  }
  res.json({ local: destaque, engajamento: engajamento })
})

app.post('/eventos', (req, res) => {
  const { tipo, dados } = req.body || {}
  if (funcoes[tipo]) {
    funcoes[tipo](dados)
  }
  res.status(200).json({ msg: 'ok' })
})

const port = 4300
app.listen(port, () => console.log(`Estatisticas. Porta ${port}`))