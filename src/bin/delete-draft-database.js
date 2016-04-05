import { Db, Server } from 'mongodb'
import validator from 'validator'
import co from 'co'


function getDraftDbNames() {
  return new Promise((resolve, reject) => {
    const connection = new Db('test', new Server('localhost', 27017))
    connection.open((err, db) => {
      if (err) reject(err)
      const adminDb = db.admin()

      adminDb.listDatabases((childErr, dbs) => {
        if (childErr) reject(childErr)
        const draftDbs = dbs.databases.filter(({ name }) => validator.isUUID(name)).map(({ name }) => name)
        db.close()
        connection.close()
        resolve(draftDbs)
      })
    })
  })
}

function dropDatabase(name) {
  return new Promise((resolve, reject) => {
    const connection = new Db(name, new Server('localhost', 27017))
    connection.open((err, db) => {
      if (err) reject(err)
      db.dropDatabase((childErr, result) => {
        if (childErr) reject(childErr)
        db.close()
        connection.close()
        resolve(result)
      })
    })
  })
}

co(function* () {
  const names = yield getDraftDbNames()
  console.log(`There has ${names.length} draft database`)
  for (const name of names) {
    const result = yield dropDatabase(name)
    console.log(`Remove ${name} complete with result ${result}`)
  }
}).catch((err) => {
  console.log(err)
})
