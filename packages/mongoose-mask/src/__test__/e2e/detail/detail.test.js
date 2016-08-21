import { createKoaRequest, createExpressRequest, expect, setUpAndTearDown } from '../config-api-test'
import koaApp from '../../_app/koa/app'
import expressApp from '../../_app/express/app'

const koaRequest = createKoaRequest(koaApp)
const expressRequest = createExpressRequest(expressApp)

const runTest = (request) => {
  describe('Detail Api', () => {
    const initialData = [
      {
        // schema,
        schemaName: 'Article',
        entities: require('../_test-data/short-list-entities.json'),
      }
    ]

    setUpAndTearDown(initialData)

    it('by id - has response', (done) => {
      const expectResponse = require('./test-data/expect-response.json')
      request.get('/article/id/567f8a571c17d9c58394970a')
        .end((error, { body }) => {
          expect(body).to.containSubset(expectResponse)
          done()
        })
    })

    it('by ids - has response', (done) => {
      const expectResponse = require('./test-data/expect-response.json')
      request.get('/article/ids')
        .query({
          ids: ['567f8a571c17d9c58394970a']
        })
        .end((error, { body }) => {
          expect(body[0]).to.containSubset(expectResponse)
          done()
        })
    })

    it('by id - not exists', (done) => {
      request.get('/article/id/567f8a571c17d9c583949999')
        .expect(400)
        .end((error, { body }) => {
          expect(body.message).to.match(/not exists/)
          done()
        })
    })

    it('by key - success', (done) => {
      const expectResponse = require('./test-data/expect-response.json')
      request.get('/article/detail/perferendis-minus-aut-quidem-illo-5')
        .end((error, { body }) => {
          expect(body).to.containSubset(expectResponse)
          done()
        })
    })

    it('by key - not exists', (done) => {
      request.get('/article/detail/not-exists')
        .expect(400)
        .end((error, { body }) => {
          expect(body.message).to.match(/not exists/)
          done()
        })
    })

    it('by filter - success', (done) => {
      const expectResponse = require('./test-data/expect-response.json')
      request.get('/article/detail-by-filter')
        .query({ filter: { slug: 'perferendis-minus-aut-quidem-illo-5' } })
        .end((error, { body }) => {
          expect(body).to.containSubset(expectResponse)
          done()
        })
    })

    it('by filter - not exists', (done) => {
      request.get('/article/detail-by-filter')
        .query({ filter: { slug: 'no-result-here' } })
        .expect(400)
        .end((error, { body }) => {
          expect(body.message).to.match(/not exists/)
          done()
        })
    })
  })
}

describe('Koa App', () => runTest(koaRequest))
describe('Express App', () => runTest(expressRequest))
