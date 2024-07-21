const multer = require('multer')
const csv = require('csv-parser')
const { Transform } = require('stream')
const upload = multer()
const TaskController = require('./TaskController')

class ImportController {
    async execute(request, response) {
        upload.single('file')(request, response, (err, file) => {
            if (err) {
                console.error(err);
                response.writeHead(500, {'Content-type': 'application/json'})
                response.end(JSON.stringify({ message: 'Erro no upload do arquivo' }))
                return;
            }
            
            const results = [];

            const bufferStream = new Transform({
                transform(chunk, encoding, callback) {
                    this.push(chunk)
                    callback()
                }
            })

            bufferStream.end(request.file.buffer)

            bufferStream
                .pipe(csv({ delimiter: ',' }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    const taskIds = []
                    results.map(async (task) => {
                        const id = await TaskController.saveTask(task.title, task.description)
                        taskIds.push(id)
                    })
                    response.writeHead(200, { 'Content-type': 'application/json' })
                    response.end(JSON.stringify({ ...taskIds }))
                })
        })
    }

}

module.exports = new ImportController()