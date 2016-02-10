import { expect } from 'chai'
import omitDeep from '../../../src/nest-omit'

describe('Omit nested', () => {
  it('1 level', () => {
    const obj = { a: 'a', b: 'b' }
    const returnObj = omitDeep(obj, 'a')
    expect(returnObj).to.deep.equal({ b: 'b' })
  })

  it('nested object', () => {
    const obj = { a: 'a', b: { c: 'c' } }
    const returnObj = omitDeep(obj, 'c')
    expect(returnObj).to.deep.equal({ a: 'a', b: {} })
  })

  it('nested array', () => {
    const obj = { a: 'a', b: [{ c: 'c', d: 'd' }] }
    const returnObj = omitDeep(obj, 'c')
    expect(returnObj).to.deep.equal({ a: 'a', b: [{ d: 'd' }] })
  })

  it('array in top level', () => {
    const obj = [{ a: 'a', b: [{ c: 'c', d: 'd' }] }]
    const returnObj = omitDeep(obj, 'c')
    expect(returnObj).to.deep.equal([{ a: 'a', b: [{ d: 'd' }] }])
  })
})
