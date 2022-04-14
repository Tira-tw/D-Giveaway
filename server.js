const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Webpage Created')
})

app.listen(port, () => {
  console.log(`準備在 : ${port}`)
})