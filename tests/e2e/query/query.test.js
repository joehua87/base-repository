import { createRequest, expect, setUpAndTearDown } from '../../../src/config-api-test'
import app from '../../_app/app'

const request = createRequest(app)

describe('Query Api', () => {
  const initialData = [
    {
      // schema,
      schemaName: 'Article',
      entities: require('./test-data/entities.json'),
    }
  ]

  setUpAndTearDown(initialData)

  it('Default query', (done) => {
    const expectResponse = require('./test-data/01-default-query.json')
    request.get('/article/query')
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('has filter', (done) => {
    const expectResponse = require('./test-data/02-filter-query.json')
    request.get('/article/query')
      .query({ filter: { title: 'perferendis' } })
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('has sort', (done) => {
    const expectResponse = require('./test-data/03-sort-query.json')
    request.get('/article/query')
      .query({ sort: 'name' })
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('paging', (done) => {
    const expectResponse = require('./test-data/04-paging-query.json')
    request.get('/article/query')
      .query({ page: 2, limit: 5 })
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })

  it('Query - has no data', (done) => {
    const expectResponse = require('./test-data/05-no-result-query.json')
    request.get('/article/query')
      .query({ filter: { title: 'no have result' } })
      .end((error, { body }) => {
        expect(body).to.containSubset(expectResponse)
        done()
      })
  })
})
