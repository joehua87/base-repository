import { createRequest, expect, setUpAndTearDown } from '../../../src/config-api-test'
import app from '../../_app/app'

const request = createRequest(app)

describe('Insert Api', () => {
  const initialData = [
    {
      schemaName: 'Article',
      entities: require('../_test-data/short-list-entities.json'),
    }
  ]

  setUpAndTearDown(initialData)

  it('valid', (done) => {
    const entity = require('./test-data/01-valid-request.json')
    const expectResponse = require('./test-data/01-valid-response.json')
    request.post('/article')
      .send(entity)
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('invalid', (done) => {
    const entity = require('./test-data/02-invalid-request.json')
    const expectResponse = require('./test-data/02-invalid-response.json')
    request.post('/article')
      .send(entity)
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('duplicated', (done) => {
    const entity = require('./test-data/03-duplicated-request.json')
    request.post('/article')
      .send(entity)
      .end((error, { body }) => {
        expect(body.message).to.match(/E11000 duplicate key error index/)
        done()
      })
  })
})
