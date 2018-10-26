const express = require('express')
const request = require('request')
const verifier = require('alexa-verifier-middleware');

const app = express()
const port = process.env.PORT || 3000
const endpoint = process.env.ENDPOINT
const origin = process.env.ORIGIN || '*'

if (!endpoint) {
  throw new Error('missing endpoint')
}
console.log(`Using endpoint: ${endpoint}`)
console.log(`Using origin: ${origin}`)

app.use((req, res, next) => {
  // Allow Origin to be specified when hosted from a different domain
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'OPTIONS,POST')
  next()
})

// Used to validate request
// https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html#verifying-that-the-request-was-sent-by-alexa
app.use('/alexa/*', verifier)

app.post('/alexa/*', (req, res) => {
  return req.pipe(request.post(endpoint)).pipe(res)
})

app.listen(port, () => console.log(`App listening on http://0.0.0.0:${port}!`))
