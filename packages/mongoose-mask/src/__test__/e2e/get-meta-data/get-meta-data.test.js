import { createKoaRequest, createExpressRequest, expect, setUpAndTearDown } from '../config-api-test'
import koaApp from '../../_app/koa/app'
import expressApp from '../../_app/express/app'

const koaRequest = createKoaRequest(koaApp)
const expressRequest = createExpressRequest(expressApp)

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

describe('Koa App', () => runTest(koaRequest))
describe('Express App', () => runTest(expressRequest))
