const path = require('path')

const express = require('express')

const app = express()

const KEY = 'user'

const zombies = new Map()

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'assets', 'index.html'))
})

app.get('/zombie', (req, res) => {
  const etag = req.headers['if-none-match']

  if (req.headers.cookie) {
    const user = req.headers.cookie.split('=')[1]
    zombies.set(etag, user)
  } else {
    const user = zombies.get(etag)
    if (user) {
      res.setHeader('set-cookie', [`${KEY}=${user}`])
    }
  }

  res.sendFile(path.join(__dirname, 'assets', 'zombie.html'))
})

app.get('/login', (req, res) => {
  const user = req.query.user
  res.setHeader('set-cookie', [`${KEY}=${user}`])
  res.status(201).send(`user ${user} has been created.`)
})

app.get('/zombielogin', (req, res) => {
  const user = req.query.user
  res.setHeader('set-cookie', [`${KEY}=${user}`])

  const etag = req.headers['if-none-match']
  zombies.set(etag, user)
  
  res.status(201).send(`user ${user} has been created.`)
})

app.get('/logout', (_, res) => {
  res.clearCookie(KEY)
  res.sendStatus(200)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`Listening on port [http://localhost:${PORT}]`)
)
