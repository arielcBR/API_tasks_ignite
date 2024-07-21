const inputChecker = require('../utils/InputChecker')
const sqliteConnection = require('../database/sqlite/index')
const url = require('url')

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

  async index(request, response) {
    try {
      const db = await sqliteConnection()
      const tasks = await db.all("SELECT * from tasks")

      response.writeHead(201, { 'Content-Type': 'application/json' })
      return response.end(JSON.stringify({ ...tasks }))
    }
    catch (error) {
      console.log(error)
      response.writeHead(500, { 'Content-Type': 'application/json' })
      return response.end(JSON.stringify({ error: 'Internal server error' }))
    }
  }

  async delete(request, response){
    const { pathname } = url.parse(request.url, true)
    const match = pathname.match(/^\/tasks\/(\d+)$/)
    const id = match ? match[1] : null
    
    if (id) {
      try {
        const db = await sqliteConnection()
        await db.run('DELETE FROM tasks WHERE id = ?', [id]);

        response.writeHead(200, { 'Content-Type': 'application/json' })
        return response.end()
      } catch (error) {
        console.log(error)
        response.writeHead(500, { 'Content-Type': 'application/json' })
        return response.end(JSON.stringify({ error: 'Internal server error' }))
      }
    }
    else {
      response.writeHead(400, { 'Content-Type': 'application/json' })
      return response.end(JSON.stringify({ error: 'Bad request' }))
    }
  }
  
  async finishTask(request, response) {
    const { pathname } = url.parse(request.url)
    const match = pathname.match(/^\/tasks\/(\d+)$/)
    const id = match ? match[1] : null

    if (id) {
      try {
        const db = await sqliteConnection()

        const task = await db.get('SELECT * from tasks WHERE id = ?', [id])

        if (!task) {
          response.writeHead(400, { 'Content-Type': 'application/json' })
          return response.end(JSON.stringify({ error: 'Bad request' }))
        }

        if (task.completed_at) {
          response.writeHead(200, { 'Content-Type': 'application/json' })
          return response.end(JSON.stringify({ message: 'Task already finished' }))
        }

        await db.run('UPDATE tasks SET completed_at = true WHERE id = ?', [id])

        response.writeHead(200, { 'Content-Type': 'application/json' })
        return response.end()
      } catch (error) {
        console.log(error)
        response.writeHead(500, { 'Content-Type': 'application/json' })
        return response.end(JSON.stringify({ error: 'Internal server error' }))
      }
    }
    else {
      response.writeHead(400, { 'Content-Type': 'application/json' })
      return response.end(JSON.stringify({ error: 'Bad request' }))
    }
  }
}

module.exports = new TaskController()