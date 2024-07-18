const sqliteConnection = require('../sqlite')
const createTasks = require('./createTasks')

async function migrationsRun(){
  const schemas = [
    createTasks
  ].join('')

  try {
    const db = await sqliteConnection()
    await db.exec(schemas)
  } 
  catch (error) {
    console.error(error)
  }
}

module.exports = migrationsRun