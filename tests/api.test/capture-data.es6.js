import co from 'co';
import mongoose from 'mongoose';
import uuid from 'uuid';

const config = {
  test: {
    dbHost: 'mongodb://localhost'
  }
};

import captureData from '../../src/helpers/capture-data';
import * as articleSchema from '../_app/article.model';
const entities = require('./test-data/initial-data/entities.json');
const app = require('../_app/app');
const supertestRequest = require('supertest').agent(app.listen());

function connect() {
  return new Promise(resolve => {
    const collection = uuid.v4();
    const host = `${config.test.dbHost}/${collection}`;
    mongoose.connect(host, () => {
      const Model = mongoose.model(articleSchema.schemaName, articleSchema.schema);
      Model.ensureIndexes(() => Model.create(entities, resolve));
    });
  });
}

const files = [
  require('./test-data/query-test-data').dataToCapture,
  require('./test-data/get-test-data').dataToCapture,
  require('./test-data/insert-test-data').dataToCapture,
  require('./test-data/validate-update-test-data').dataToCapture,
  require('./test-data/remove-test-data').dataToCapture,
  require('./test-data/add-child-test-data').dataToCapture,
  require('./test-data/remove-child-test-data').dataToCapture
];

co(function* () {
  for (const datas of files) {
    for (const data of datas) {
      yield connect();
      yield captureData(supertestRequest, data);
      mongoose.connection.db.dropDatabase();
      yield new Promise(done => mongoose.connection.close(done));
    }
  }

  console.log('Complete');
  process.exit();

}).catch(err => {
  mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
  console.log(err);
});
