import path from 'path'
import co from 'co'
import { expect } from 'chai'
import readFromCsv from '../../../src/read-from-csv'

describe('Read from csv', () => {
  const srcPath = path.resolve(__dirname, './test-data/data.csv')
  const expectEntities = require('./test-data/result.json')

  it('should success', co.wrap(function*() {
    const entities = yield readFromCsv(srcPath)
    expect(entities).to.deep.equal(expectEntities)
  }))
})
