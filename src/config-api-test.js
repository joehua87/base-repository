import co from 'co'
import mongoose from 'mongoose'
import uuid from'uuid'

/**
 * Set up a database with a uuid name
 * @param initialData
 */
export function setUpAndTearDown(initialData) {
  before(co.wrap(function*() {
    const dbName = uuid.v4()
    const host = `mongodb://localhost/${dbName}`
    mongoose.connect(host)

    if (initialData) {
      for (const item of initialData) {
        let Model = mongoose.model(item.schemaName)
        if (!Model) {
          Model = mongoose.model(item.schemaName, item.schema)
        }
        yield Model.ensureIndexes()
        yield Model.create(item.entities)
      }
    }
  }))

  after((done) => {
    mongoose.connection.db.dropDatabase()
    mongoose.connection.close(done)
  })
}

export function createRequest(app) {
  return require('supertest').agent(app.listen())
}

const chai = require('chai')
chai.use(require('chai-subset'))
chai.use(require('chai-things'))
export const expect = chai.expect
