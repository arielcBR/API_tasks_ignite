const taskController = require('../controllers/TaskController')

function tasks (request, response) {
  const { method } = request

  if(method === 'POST'){
    taskController.create(request, response)
  }
  else if (method === 'GET') {
    taskController.index(request, response)
  }
  else if (method === 'DELETE') {
    taskController.delete(request, response)
  }
  else if (method === 'PATCH') {  
    taskController.finishTask(request, response)
  }
  else if (method === 'PUT') {
    taskController.update(request, response)
  }
  else {
    response.statusCode = 405
    response.end('Method Not Allowed')
  }

}

module.exports = tasks