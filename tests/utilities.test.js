import { expect } from 'chai';
import { parseQueryRequest } from '../src/create-controller';


describe('Parse Query Request', () => {
  it('should ignore invalid page & limit', () => {
    const request = {
      query: {
        page: 'a',
        limit: 'b',
      }
    };
    const parsedQuery = parseQueryRequest(request);
    expect(parsedQuery.select).to.not.have.property('page');
    expect(parsedQuery.select).to.not.have.property('limit');
  });

  it('valid page & limit', () => {
    const request = {
      query: {
        page: '1',
        limit: '10',
      }
    };
    const parsedQuery = parseQueryRequest(request);
    expect(parsedQuery.select).to.have.property('page');
    expect(parsedQuery.select).to.have.property('limit');
  });
});
