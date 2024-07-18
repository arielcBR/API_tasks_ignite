const url = require('url')
const tasks = require('./tasks')

function router(request, response) {
  const { pathname } = url.parse(request.url, true)
  
  if(pathname === '/tasks') {
    tasks(request, response)
  }
  else {
    response.statusCode = 404
    response.end('Page Not Found')
  }
}

module.exports = router