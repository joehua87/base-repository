import { createKoaRequest, expect, setUpAndTearDown } from '../config-api-test'
import koaApp from '../../_koaApp/app'

const koaRequest = createKoaRequest(koaApp)

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
        .end((error, { body }) => {
          expect(body).to.deep.equal({})
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
        .end((error, { body }) => {
          expect(body).to.deep.equal({})
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
        .end((error, { body }) => {
          expect(body).to.deep.equal({})
          done()
        })
    })
  })
}

runTest(koaRequest)
