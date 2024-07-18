const http = require('http')
const router = require('./routes')
const migrationsRun = require('./database/migrations')
const PORT = 4000

// create database tables
migrationsRun()

// create server
const server = http.createServer()

server.on('request', (request, response) => {
  router(request, response)
})

server.listen(PORT, () => console.log(`Server online in the PORT ${PORT}`))