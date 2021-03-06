import { createRequest, expect, setUpAndTearDown } from '../../../src/config-api-test'
import app from '../../_app/app'

const request = createRequest(app)

describe('Remove Api', () => {
  const initialData = [
    {
      // schema,
      schemaName: 'Article',
      entities: require('../_test-data/short-list-entities.json'),
    }
  ]

  setUpAndTearDown(initialData)

  it('valid', (done) => {
    request.del('/article/delete/567f8a571c17d9c58394970a')
      .end((error, { body, status }) => {
        expect(status).to.equal(200)
        expect(body).to.deep.equal({ _id: '567f8a571c17d9c58394970a' })
        done()
      })
  })

  it('not exists', (done) => {
    request.del('/article/delete/567f8a571c17d9c583949999')
      .end((error, { body, status }) => {
        expect(status).to.equal(400)
        expect(body).to.containSubset({
          message: 'Not exists entity'
        })
        done()
      })
  })
})
