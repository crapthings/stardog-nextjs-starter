const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const api = require('./api')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const router = express.Router()

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())

  server.use('/api', api({ router }))

  // server.get('/a', (req, res) => {
  //   return app.render(req, res, '/a', req.query)
  // })

  server.all('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
