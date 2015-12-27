import co from 'co';
import path from 'path';
import * as articleSchema from '../../../examples/src/article.model';
import generateTestData from '../generate-test-data';

const testData = require('./test-data/request-test-data');

co(function* () {
  yield generateTestData(articleSchema, 'article', testData, path.resolve(__dirname, 'test-data/response-test-data'));
  console.log('Complete');
}).catch(err => {
  console.log('Errors', err);
  console.log('Errors Stack', err.stack);
});
