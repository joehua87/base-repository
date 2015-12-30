import { expect } from 'chai';
import omitDeep from '../src/helpers/omit-nested';


describe('Omit nested', () => {
  it('Should work with 1 level', () => {
    const obj = {a: 'a', b: 'b'};
    const returnObj = omitDeep(obj, 'a');
    expect(returnObj).to.deep.equal({b: 'b'});
  });

  it('Should work with nested object', () => {
    const obj = {a: 'a', b: {c: 'c'}};
    const returnObj = omitDeep(obj, 'c');
    expect(returnObj).to.deep.equal({a: 'a', b: {}});
  });

  it('Should work with nested array', () => {
    const obj = {a: 'a', b: [{c: 'c', d: 'd'}]};
    const returnObj = omitDeep(obj, 'c');
    expect(returnObj).to.deep.equal({a: 'a', b: [{d: 'd'}]});
  });
});
