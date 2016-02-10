import { createRequest, expect, setUpAndTearDown } from '../../../src/config-api-test'
import app from '../../_app/app'

const request = createRequest(app)

describe('Detail Api', () => {
  setUpAndTearDown()

  it('get config', (done) => {
    request.get('/article/get-config')
      .end((error, { status }) => {
        expect(status).to.equal(200)
        done()
      })
  })

  it('get schema', (done) => {
    request.get('/article/get-schema')
      .end((error, { status }) => {
        expect(status).to.equal(200)
        done()
      })
  })
})
