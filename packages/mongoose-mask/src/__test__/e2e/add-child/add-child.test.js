import { createKoaRequest, createExpressRequest, expect, setUpAndTearDown } from '../config-api-test'
import koaApp from '../../_app/koa/app'
import expressApp from '../../_app/express/app'

const koaRequest = createKoaRequest(koaApp)
const expressRequest = createExpressRequest(expressApp)

const runTest = (request) => {
  describe('Add Child Api', () => {
    const initialData = [
      {
        // schema,
        schemaName: 'Article',
        entities: require('../_test-data/short-list-entities.json'),
      }
    ]

    setUpAndTearDown(initialData)

    it('invalid', (done) => {
      request.put('/article/567f8a571c17d9c58394970a/add-child/tags')
        .send({
          name: 'Healthy Recipes'
        })
        .end((error, { body, status }) => {
          expect(status).to.equal(400)
          expect(body).to.deep.containSubset({
            message: 'Validate fail at: tags.4.slug'
          })
          done()
        })
    })

    it('valid', (done) => {
      request.put('/article/567f8a571c17d9c58394970a/add-child/tags')
        .send({
          slug: 'healthy-recipes',
          name: 'Healthy Recipes'
        })
        .end((error, { body, status }) => {
          expect(status).to.equal(201)
          expect(body).to.containSubset({
            slug: 'healthy-recipes',
            name: 'Healthy Recipes'
          })
          done()
        })
    })

    it('not exists parent', (done) => {
      request.put('/article/567f8a571c17d9c583949999/add-child/tags')
        .send({
          slug: 'healthy-recipes',
          name: 'Healthy Recipes'
        })
        .end((error, { body, status }) => {
          expect(status).to.equal(400)
          expect(body).to.containSubset({
            message: 'Not exists parent'
          })
          done()
        })
    })
  })
}

describe('Express App', () => runTest(expressRequest))
describe('Koa App', () => runTest(koaRequest))
