import { createKoaRequest, expect, setUpAndTearDown } from '../config-api-test'
import koaApp from '../../_app/koa/app'

const koaRequest = createKoaRequest(koaApp)

const runTest = (request) => {
  describe('Detail Api', () => {
    setUpAndTearDown()

    it('get config', (done) => {
      request.get('/article/get-config')
        .end((error, { status, body }) => {
          expect(status).to.equal(200)
          expect(body.fields).to.all.have.property('dbType')
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
}

runTest(koaRequest)
