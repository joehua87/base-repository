import { createKoaRequest, expect, setUpAndTearDown } from '../config-api-test'
import koaApp from '../../_app/koa/app'

const koaRequest = createKoaRequest(koaApp)

const runTest = (request) => {
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
        .query({ sort: 'title' })
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
}

runTest(koaRequest)
