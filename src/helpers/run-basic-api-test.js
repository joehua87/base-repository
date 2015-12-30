import mongoose from 'mongoose';
import uuid from 'uuid';
import path from 'path';

import omitNested from './omit-nested';

const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;

const config = {
  test: {
    dbHost: 'mongodb://localhost'
  }
}

function configSetupAndTearDown(schema, entities) {
  before((done) => {
    const collection = uuid.v4();
    const host = `${config.test.dbHost}/${collection}`;
    mongoose.connect(host, () => {
      const Model = mongoose.model(schema.schemaName, schema.schema);
      Model.create(entities, done);
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close(done);
  });
}

/**
 * Run Basic Api Test for a specific type
 * @param app
 * @param endPoint
 * @param schema - Mongoose schema of type to validate
 * @param data
 */
export default function runApiTest(app, endPoint, schema, data, responseFolderPath) {
  const request = require('supertest').agent(app.listen());

  describe('Querying', () => {

    configSetupAndTearDown(schema, data.entities);

    it('Query with sort - has data', (done) => {
      const expectedResponse = omitNested(require(path.resolve(responseFolderPath, 'query/01-filter-response.json')), 'modifiedTime');

      request.get(`/${endPoint}/query`)
        .query(data.queryData.queryWithFilterRequest)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.body).to.containSubset(expectedResponse);
          done();
        });
    });

    it('Query with paging - has data', () => {

    });

    it('Query with projection - has data', () => {

    });

    it('Query with getAll - has data', () => {

    });

    it('Query - has no data', () => {

    });

    it('Get by id - has data', (done) => {
      const expectedResponse = omitNested(require(path.resolve(responseFolderPath, 'get/valid-id-response.json')), 'modifiedTime');

      request.get(`/${endPoint}/id/${data.getData.validId}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.body).to.containSubset(expectedResponse);
          done();
        });
    });

    it('Get by id - has no data', () => {

    });

    it('Get by key - has data', () => {

    });

    it('Get by key - has no data', () => {

    });

    it('Get by query - has data', () => {

    });

    it('Get by query - has no data', () => {

    });
  });

  describe('Create & Insert', () => {

    configSetupAndTearDown(schema, data.entities);

    it('Create succcess', () => {
    });


    it('Insert - valid data', done => {
      let expectedResponse = require(path.resolve(responseFolderPath, 'insert/01-valid-response.json'));
      expectedResponse = omitNested(expectedResponse, ['_id', 'createdTime', 'modifiedTime']);
      request.post(`/${endPoint}`)
        .send(data.insertData.validEntity)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.body).to.containSubset(expectedResponse);
          done();
        });
    });


    it('Insert - invalid data', () => {

    });

  });

  describe('Validate Update', () => {

    configSetupAndTearDown(schema, data.entities);

    it('Validate Update - valid data', (done) => {
      let expectedResponse = require(path.resolve(responseFolderPath, 'update/01-valid-response.json'));
      expectedResponse = omitNested(expectedResponse, ['_id', 'createdTime', 'modifiedTime']);
      request.put(`/${endPoint}/validate-update`)
        .send(data.validateUpdateData.validEntity)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.body).to.containSubset(expectedResponse);
          done();
        });
    });


    it('Validate Update - has no _id', () => {

    });


    it('Validate Update - has invalid _id', () => {

    });


    it('Validate Update - invalid data', () => {

    });

  });

  describe('Delete', () => {

    configSetupAndTearDown(schema, data.entities);

    it('Validate Delete - valid data', (done) => {
      let expectedResponse = require(path.resolve(responseFolderPath, 'delete/01-valid-response.json'));
      expectedResponse = omitNested(expectedResponse, ['_id', 'createdTime', 'modifiedTime']);

      request.del(`/${endPoint}/delete/${data.removeData.validId}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.body).to.containSubset(expectedResponse);
          done();
        });
    });
  });

  describe('Add & Remove Child', () => {

    configSetupAndTearDown(schema, data.entities);

    it('Add valid child - success', (done) => {
      let expectedResponse = require(path.resolve(responseFolderPath, 'add-child/01-valid-response.json'));
      expectedResponse = omitNested(expectedResponse, ['_id', 'createdTime', 'modifiedTime']);

      request.put(`/${endPoint}/${data.addChildData.validRequest.parentId}/add-child/${data.addChildData.validRequest.field}`)
        .send(data.addChildData.validRequest.itemToAdd)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.body).to.containSubset(expectedResponse);
          done();
        });
    });

    it('Add invalid child - fail', () => {

    });

    it('Remove valid child - success', (done) => {
      let expectedResponse = require(path.resolve(responseFolderPath, 'remove-child/01-valid-response.json'));
      expectedResponse = omitNested(expectedResponse, ['_id', 'createdTime', 'modifiedTime']);

      request.del(`/${endPoint}/${data.removeChildData.validRequest.parentId}/remove-child/${data.addChildData.validRequest.field}/${data.removeChildData.validRequest.childId}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            done(err);
          }

          expect(res.body).to.containSubset(expectedResponse);
          done();
        });
    });

    it('Remove invalid child - fail', () => {

    });
  });

  describe('Get config & Schema', () => {

    // configSetupAndTearDown();

    it('Get config', () => {

    });

    it('Get Schema', () => {

    });
  });

// TODO Update Test
}

describe('Api Tests', () => {
});
