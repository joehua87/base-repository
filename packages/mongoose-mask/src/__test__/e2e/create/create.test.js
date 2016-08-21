import { createKoaRequest, expect, setUpAndTearDown } from '../config-api-test'
import koaApp from '../../_koaApp/app'

const koaRequest = createKoaRequest(koaApp)

const runTest = (request) => {
  describe('Create Api', () => {
    const initialData = [
      {
        schemaName: 'Article',
        entities: require('../_test-data/short-list-entities.json'),
      }
    ]

    setUpAndTearDown(initialData)

    it('valid', (done) => {
      // const expectResponse = require('./test-data/01-valid-response.json')
      request.post('/article/create')
        .end((error, { body }) => {
          expect(body).to.containSubset({
            slug: 'untitled-1',
            title: 'Untitled 1',
            conversionRate: 0,
            commentsCount: 0,
            isFeatured: false,
            tags: [],
            comments: [],
            published: false
          })
          done()
        })
    })

    it('will increase id', (done) => {
      request.post('/article/create')
        .end((error, { body }) => {
          expect(body).to.containSubset({
            slug: 'untitled-2',
            title: 'Untitled 2',
            conversionRate: 0,
            commentsCount: 0,
            isFeatured: false,
            tags: [],
            comments: [],
            published: false
          })
          done()
        })
    })

    it('with default value', (done) => {
      request.post('/article/create')
        .send({
          conversionRate: 3,
          commentsCount: 3
        })
        .end((error, { body }) => {
          expect(body).to.containSubset({
            slug: 'untitled-3',
            title: 'Untitled 3',
            conversionRate: 3,
            commentsCount: 3,
            isFeatured: false,
            tags: [],
            comments: [],
            published: false
          })
          done()
        })
    })

    it('with filter', (done) => {
      request.post('/article/create')
        .query({ filter: { website: 'hello-world.com' } })
        .end((error, { body }) => {
          expect(body).to.containSubset({
            slug: 'untitled-1',
            title: 'Untitled 1',
            website: 'hello-world.com',
          })
          done()
        })
    })

    it('invalidate', (done) => {
      const entity = require('./test-data/invalid-request.json')
      request.post('/article/create')
        .query({ filter: { website: 'hello-world.com' } })
        .send(entity)
        .end((error, { body, status }) => {
          expect(status).to.equal(400)
          expect(body).to.containSubset({
            message: 'Validate fail at: tags.0.slug',
          })
          done()
        })
    })
  })
}

runTest(koaRequest)
