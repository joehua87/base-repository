const chai = require('chai')
chai.use(require('chai-subset'))
const expect = chai.expect

export default function runTest(app) {
  const request = require('supertest').agent(app.listen())
}
