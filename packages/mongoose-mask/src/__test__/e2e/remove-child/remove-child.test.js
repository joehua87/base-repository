import { createKoaRequest, expect, setUpAndTearDown } from '../config-api-test'
import koaApp from '../../_app/koa/app'

const koaRequest = createKoaRequest(koaApp)

const runTest = (request) => {
  describe('Remove Api', () => {
    const initialData = [
      {
        // schema,
        schemaName: 'Article',
        entities: require('../_test-data/short-list-entities.json'),
      }
    ]

    setUpAndTearDown(initialData)

    it('not exists child id', (done) => {
      request.del('/article/567f8a571c17d9c58394970a/remove-child/tags/567f8a571c17d9c583949999')
        .end((error, { body, status }) => {
          expect(status).to.equal(400)
          expect(body).to.containSubset({
            message: 'Not exists child'
          })
          done()
        })
    })

    it('not exists parent id', (done) => {
      request.del('/article/567f8a571c17d9c583949999/remove-child/tags/567f8a571c17d9c583949712')
        .end((error, { body, status }) => {
          expect(status).to.equal(400)
          expect(body).to.containSubset({
            message: 'Not exists parent'
          })
          done()
        })
    })

    it('valid', (done) => {
      request.del('/article/567f8a571c17d9c58394970a/remove-child/tags/567f8a571c17d9c583949712')
        .end((error, { body, status }) => {
          expect(status).to.equal(200)
          expect(body).to.deep.equal({
            slug: 'healthy-recipes',
            name: 'Healthy Recipes',
            _id: '567f8a571c17d9c583949712'
          })
          done()
        })
    })
  })
}

runTest(koaRequest)
