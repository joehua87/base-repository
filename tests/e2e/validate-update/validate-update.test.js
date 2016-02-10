import { createRequest, expect, setUpAndTearDown } from '../../../src/config-api-test'
import app from '../../_app/app'

const request = createRequest(app)

describe('Validate Update Api', () => {
  const initialData = [
    {
      // schema,
      schemaName: 'Article',
      entities: require('./test-data/entities.json'),
    }
  ]

  setUpAndTearDown(initialData)

  it('valid', (done) => {
    const entity = require('./test-data/01-valid-request.json')
    const expectResponse = require('./test-data/01-valid-response.json')
    request.put('/article/validate-update')
      .send(entity)
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('invalid', (done) => {
    const entity = require('./test-data/02-invalid-request.json')
    const expectResponse = require('./test-data/02-invalid-response.json')
    request.put('/article/validate-update')
      .send(entity)
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('duplicated', (done) => {
    const entity = require('./test-data/03-duplicated-request.json')
    request.put('/article/validate-update')
      .send(entity)
      .end((error, { body }) => {
        expect(body.message).to.match(/E11000 duplicate key error index/)
        done()
      })
  })

  it('body has no _id', (done) => {
    const entity = require('./test-data/04-no-id-request.json')
    const expectResponse = require('./test-data/04-no-id-response.json')
    request.put('/article/validate-update')
      .send(entity)
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('not exists', (done) => {
    const entity = require('./test-data/05-not-exists-request.json')
    const expectResponse = require('./test-data/05-not-exists-response.json')
    request.put('/article/validate-update')
      .send(entity)
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })
})
