import co from 'co';
import path from 'path';
import fs from 'co-fs-extra';
import { toMongoDbEntities } from './../../src/helpers/generate-test-data';

const entities = require('./../.././test-data/request-test-data/entities.json');
import * as articleSchema from '../article.model.js';

co(function* () {
  const mongodbEntities = yield toMongoDbEntities(articleSchema, entities);
  yield fs.writeFile(path.resolve(__dirname, 'mongodb-entities.json'), JSON.stringify(mongodbEntities, null, 2));
}).catch((err) => {
  console.log(err);
});
