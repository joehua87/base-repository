import mongoose from 'mongoose';
import uuid from 'uuid';

const config = {
  test: {
    dbHost: 'mongodb://localhost'
  }
}
const app = '';
const request = require('supertest').agent(app.listen());

/**
 * Exercise to generate testing data - we will modify this later
 * @param endPoint
 * @param data
 * @param output
 * @returns {*}
 */

function configSetupAndTearDown(schema, data) {
  before((done) => {
    const collection = uuid.v4();
    const host = `${config.test.dbHost}/${collection}`;
    mongoose.connect(host, () => {
      const Model = mongoose.model(schema.schemaName, schema.schema);
      Model.create(data.entities, done);
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
    });
  });
}


/**
 * Run Basic Api Test for a specific files
 * @param schema - Mongoose schema of type to validate
 * @param data
 */
export function runApiTest(schema, data) {

  describe('Querying', () => {

    configSetupAndTearDown();

    it('Query with sort - has data', () => {

    });

    it('Query with paging - has data', () => {

    });

    it('Query with projection - has data', () => {

    });

    it('Query with getAll - has data', () => {

    });

    it('Query - has no data', () => {

    });

    it('Get by id - has data', () => {

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

    configSetupAndTearDown();

    it('Create succcess', () => {

    });


    it('Insert - valid data', () => {

    });


    it('Insert - invalid data', () => {

    });

  });

  describe('Validate Update', () => {

    configSetupAndTearDown();


    it('Validate Update - valid data', () => {

    });


    it('Validate Update - has no _id', () => {

    });


    it('Validate Update - has invalid _id', () => {

    });


    it('Validate Update - invalid data', () => {

    });

  });

  describe('Remove', () => {

    configSetupAndTearDown();

  });

  describe('Add & Remove Child', () => {

    configSetupAndTearDown();

    it('Add valid child - success', () => {

    });

    it('Add invalid child - fail', () => {

    });

    it('Remove valid child - success', () => {

    });

    it('Remove invalid child - fail', () => {

    });
  });

  describe('Get config & Schema', () => {

    configSetupAndTearDown();

    it('Get config', () => {

    });

    it('Get Schema', () => {

    });
  });

// TODO Update Test
}

describe('Api Tests', () => {
});
