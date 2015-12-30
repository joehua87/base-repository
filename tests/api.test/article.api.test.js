import { expect } from 'chai';
import mongoose from 'mongoose';
import uuid from 'uuid';

const config = {
  test: {
    dbHost: 'mongodb://localhost'
  }
};

import runApiTest from '../../src/helpers/run-api-test';
import * as articleSchema from '../_app/article.model';
const entities = require('./test-data/initial-data/entities.json');
const app = require('../_app/app');
const supertestRequest = require('supertest').agent(app.listen());

function configSetupAndTearDown() {
  before((done) => {
    const collection = uuid.v4();
    const host = `${config.test.dbHost}/${collection}`;
    mongoose.connect(host, () => {
      const Model = mongoose.model(articleSchema.schemaName, articleSchema.schema);
      Model.ensureIndexes(() => Model.create(entities, done));
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close(done);
  });
}

describe('Api Test', () => {
  describe('Query', () => {
    configSetupAndTearDown();

    const captureData = require('./test-data/query-test-data').dataToCapture;
    for (const item of captureData) {
      it(item.name, runApiTest(supertestRequest, item, expect));
    }
  });

  describe('Get', () => {
    configSetupAndTearDown();
    const captureData = require('./test-data/get-test-data').dataToCapture;
    for (const item of captureData) {
      it(item.name, runApiTest(supertestRequest, item, expect));
    }
  });

  describe('Insert', () => {
    configSetupAndTearDown();
    const captureData = require('./test-data/insert-test-data').dataToCapture;
    for (const item of captureData) {
      it(item.name, runApiTest(supertestRequest, item, expect));
    }
  });

  describe('Validate Update', () => {
    configSetupAndTearDown();
    const captureData = require('./test-data/validate-update-test-data').dataToCapture;
    for (const item of captureData) {
      it(item.name, runApiTest(supertestRequest, item, expect));
    }
  });

  describe('Remove', () => {
    configSetupAndTearDown();
    const captureData = require('./test-data/remove-test-data').dataToCapture;
    for (const item of captureData) {
      it(item.name, runApiTest(supertestRequest, item, expect));
    }
  });

  describe('Add Child', () => {
    configSetupAndTearDown();
    const captureData = require('./test-data/add-child-test-data').dataToCapture;
    for (const item of captureData) {
      it(item.name, runApiTest(supertestRequest, item, expect));
    }
  });

  describe('Remove Child', () => {
    configSetupAndTearDown();
    const captureData = require('./test-data/remove-child-test-data').dataToCapture;
    for (const item of captureData) {
      it(item.name, runApiTest(supertestRequest, item, expect));
    }
  });
});
