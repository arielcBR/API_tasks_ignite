const taskController = require('../controllers/TaskController')

function tasks (request, response) {
  const { method } = request

  if(method === 'POST'){
    taskController.create(request, response)
  }
  else {
    response.statusCode = 405
    response.end('Method Not Allowed')
  }

}

module.exports = tasks