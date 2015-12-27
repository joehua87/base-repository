import co from 'co';
import path from 'path';
import fs from 'co-fs-extra';
import toMongoDbEntities from './to-mongodb-entities';

const entities = require('./article/test-data/request-test-data/entities.json');
import * as articleSchema from '../article.model';

co(function* () {
  const mongodbEntities = yield toMongoDbEntities(articleSchema, entities);
  yield fs.writeFile(path.resolve(__dirname, 'mongodb-entities.json'), JSON.stringify(mongodbEntities, null, 2));
}).catch((err) => {
  console.log(err);
});
