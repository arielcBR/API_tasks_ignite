const importController = require('../controllers/ImportController')

async function importTasks (request, response) {
  const { method } = request

  if(method !== 'POST'){
    response.writeHead(405, {'Content-type': 'application/json'})
    return response.end(JSON.stringify({ message: 'Method Not Allowed'}))
  }
  
  importController.execute(request, response)
}

module.exports = importTasks