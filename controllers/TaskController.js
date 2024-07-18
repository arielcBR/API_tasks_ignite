const inputChecker = require('../utils/InputChecker')
const sqliteConnection = require('../database/sqlite/index')

class TaskController {
  async create(request, response){
    let body = ''

    request.on('data', chunk => {
      body += chunk.toString()
    })

    request.on('end', async() => {
      const { title, description } = JSON.parse(body);
      const isDescriptionValid = inputChecker.text(description)
      const isTitleValid = inputChecker.text(title)
  
      if(!isTitleValid || !isDescriptionValid){
        response.writeHead(400, {'Content-type': 'application/json'})
        return response.end(JSON.stringify({error: 'Invalid input'}))
      }
      
      try {
        const db = await sqliteConnection()
        await db.run("INSERT INTO tasks (title, description) VALUES (?, ?)", [title, description])

        const { lastID } = await db.get('SELECT last_insert_rowid() as lastID')

        response.writeHead(201, {'Content-Type': 'application/json'})
        return response.end(JSON.stringify({ taskId: lastID }))
      } 
      catch (error) {
        console.log(error)
        response.writeHead(500, {'Content-Type': 'application/json'})
        return response.end(JSON.stringify({ error: 'Internal server error' }))
      }
    })

  }
}

module.exports = new TaskController()