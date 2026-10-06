const express = require('express')
const app = express()
app.use(express.json())

const avistamentos = {}
let contador = 0

app.get('/avistamentos', (req, res) => {
  res.json(avistamentos)
})

app.put('/avistamentos', (req, res) => {
  const { local, descricao } = req.body || {}
  if (!local || !descricao) {
    return res.status(400).json({ erro: 'local e descricao são obrigatórios' })
  }
  contador++
  avistamentos[contador] = { id: contador, local: local, descricao: descricao }
  res.status(201).json(avistamentos[contador])
})

app.post('/eventos', (req, res) => {
  console.log(req.body.tipo)
  res.status(200).json({ msg: 'ok' })
})

const port = 4000
app.listen(port, () => console.log(`Avistamentos. Porta ${port}`))