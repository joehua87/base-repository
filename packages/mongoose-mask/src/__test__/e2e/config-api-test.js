import mongoose from 'mongoose'
import uuid from 'uuid'

const dbHost = process.env.DB_HOST || 'localhost'

/**
 * Set up a database with a uuid name
 * @param initialData
 */
export function setUpAndTearDown(initialData) {
  before(async () => {
    const host = `${dbHost}/${uuid.v4()}`
    mongoose.connect(host)

    if (initialData) {
      for (const item of initialData) {
        let Model = mongoose.model(item.schemaName)
        if (!Model) {
          Model = mongoose.model(item.schemaName, item.schema)
        }
        await Model.ensureIndexes()
        await Model.create(item.entities)
      }
    }
  })

  after(async (done) => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
    done()
  })
}

export function createRequest(app) {
  return require('supertest').agent(app.listen())
}

const chai = require('chai')
chai.use(require('chai-subset'))
chai.use(require('chai-things'))
export const expect = chai.expect
