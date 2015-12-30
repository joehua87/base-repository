import path from 'path';
import fs from 'co-fs-extra';
import mongoose from 'mongoose';
import uuid from 'uuid';

const config = {
  test: {
    dbHost: 'mongodb://localhost'
  }
};

const app = require('../../examples/src/app');
const request = require('supertest').agent(app.listen());


/**
 * Transfer a list of entities to mongodb entities, to get _id, use for testing initial data.
 * Call this manually in dev
 * @param schema
 * @param entities
 * @returns Object[] - a list of entities with _id, __v, ...
 */
export function* toMongoDbEntities(schema, entities) {
  const collection = uuid.v4();
  mongoose.connect(`mongodb://localhost/${collection}`);

  const Article = mongoose.model(schema.schemaName, schema.schema);
  const mongodbEntities = yield Article.create(entities);
  return mongodbEntities.map(entity => entity.toObject());
}


export function generateInitialData(schema, entities) {
  return new Promise((resolve) => {
    const collection = uuid.v4();
    const host = `${config.test.dbHost}/${collection}`;
    mongoose.connect(host, () => {
      const Model = mongoose.model(schema.schemaName, schema.schema);
      Model.ensureIndexes(() => Model.create(entities, resolve(host)));
    });
  });
}
export function cleanData() {
  return new Promise(resolve => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close(resolve);
  });
}

export class QueryFactory {
  constructor(request, endPoint) {

  }
}

function createQueryPromise(endPoint, query) {
  return new Promise(resolve => {
    request.get(`/${endPoint}/query`)
      .query(query)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          resolve(err);
        }
        resolve(res.body);
      });
  });
}

function createInsertPromise(endPoint, body) {
  return new Promise(resolve => {
    request.post(`/${endPoint}`)
      .set('Accept', 'application/json')
      .send(body)
      .end((err, res) => {
        if (err) {
          resolve(err);
        }
        resolve(res.body);
      });
  });
}

function createValidateUpdatePromise(endPoint, body) {
  return new Promise(resolve => {
    request.put(`/${endPoint}/validate-update`)
      .set('Accept', 'application/json')
      .send(body)
      .end((err, res) => {
        if (err) {
          resolve(err);
        }
        resolve(res.body);
      });
  });
}

function createRemovePromise(endPoint, id) {
  return new Promise(resolve => {
    request.del(`/${endPoint}/delete/${id}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          resolve(err);
        }
        resolve(res.body);
      });
  });
}

function createAddChildPromise(endPoint, requestContent) {
  const { parentId, field, itemToAdd } = requestContent;
  return new Promise(resolve => {
    request.put(`/${endPoint}/${parentId}/add-child/${field}`)
      .set('Accept', 'application/json')
      .send(itemToAdd)
      .end((err, res) => {
        if (err) {
          resolve(err);
        }
        resolve(res.body);
      });
  });

}

function createRemoveChildPromise(endPoint, requestContent) {
  const { parentId, field, childId } = requestContent;
  return new Promise(resolve => {
    request.del(`/${endPoint}/${parentId}/remove-child/${field}/${childId}`)
      .set('Accept', 'application/json')
      .end((err, res) => {
        if (err) {
          resolve(err);
        }
        resolve(res.body);
      });
  });
}

/**
 *
 * Generate Tested Query Data
 * @param endPoint
 * @param entities
 * @param queryData
 * @param queryData.queryWithFilterRequest
 * @param queryData.queryWithSortRequest
 * @param queryData.queryWithPagingRequest
 * @param queryData.queryWithGetAllRequest
 * @param queryData.queryWithProjectionRequest
 * @param queryData.queryWithNoDataRequest
 * @param {String} output - Output Generated Test Data
 * @returns {{queryWithFilterResponse: *, queryWithSortResponse: *, queryWithPagingResponse: *, queryWithGetAllResponse: *, queryWithProjectionResponse: *, queryWithNoDataResponse: *}}
 */
export function* generateQueryData(schema, endPoint, entities, queryData, output) {

  yield generateInitialData(schema, entities);
  const queryWithFilterResponse = yield createQueryPromise(endPoint, queryData.queryWithFilterRequest);
  const queryWithSortResponse = yield createQueryPromise(endPoint, queryData.queryWithSortRequest);
  const queryWithPagingResponse = yield createQueryPromise(endPoint, queryData.queryWithPagingRequest);
  const queryWithGetAllResponse = yield createQueryPromise(endPoint, queryData.queryWithGetAllRequest);
  const queryWithProjectionResponse = yield createQueryPromise(endPoint, queryData.queryWithProjectionRequest);
  const queryWithNoDataResponse = yield createQueryPromise(endPoint, queryData.queryWithNoDataRequest);

  yield cleanData();

  const queryFolder = path.resolve(output, 'query');
  yield fs.mkdirp(queryFolder);

  const filterResponsePath = path.resolve(queryFolder, '01-filter-response.json');
  const sortResponsePath = path.resolve(queryFolder, '02-sort-response.json');
  const pagingResponsePath = path.resolve(queryFolder, '03-paging-response.json');
  const getAllResponsePath = path.resolve(queryFolder, '04-get-all-response.json');
  const projectionResponsePath = path.resolve(queryFolder, '05-projection-response.json');
  const noDataResponsePath = path.resolve(queryFolder, '06-no-data-response.json');

  yield fs.writeFile(filterResponsePath, JSON.stringify(queryWithFilterResponse, null, 2));
  yield fs.writeFile(sortResponsePath, JSON.stringify(queryWithSortResponse, null, 2));
  yield fs.writeFile(pagingResponsePath, JSON.stringify(queryWithPagingResponse, null, 2));
  yield fs.writeFile(getAllResponsePath, JSON.stringify(queryWithGetAllResponse, null, 2));
  yield fs.writeFile(projectionResponsePath, JSON.stringify(queryWithProjectionResponse, null, 2));
  yield fs.writeFile(noDataResponsePath, JSON.stringify(queryWithNoDataResponse, null, 2));

  return {
    filterResponsePath,
    sortResponsePath,
    pagingResponsePath,
    getAllResponsePath,
    projectionResponsePath,
    noDataResponsePath
  };
}

/**
 * Generate Tested Insert Data
 * @param {String} endPoint
 * @param entities
 * @param insertData
 * @param insertData.validEntity
 * @param insertData.invalidEntity
 * @param insertData.duplicatedEntity
 * @param {String} output - Output Generated Test Data
 */
export function* generateInsertData(schema, endPoint, entities, insertData, output) {
  yield generateInitialData(schema, entities);

  const validEntityResponse = yield createInsertPromise(endPoint, insertData.validEntity);
  const invalidEntityResponse = yield createInsertPromise(endPoint, insertData.invalidEntity);
  const duplicatedEntityResponse = yield createInsertPromise(endPoint, insertData.duplicatedEntity);

  yield cleanData();

  const insertFolder = path.resolve(output, 'insert');
  yield fs.mkdirp(insertFolder);

  const validResponsePath = path.resolve(insertFolder, '01-valid-response.json');
  const invalidResponsePath = path.resolve(insertFolder, '02-invalid-response.json');
  const duplicatedResponsePath = path.resolve(insertFolder, '03-duplicated-response.json');

  yield fs.writeFile(validResponsePath, JSON.stringify(validEntityResponse, null, 2));
  yield fs.writeFile(invalidResponsePath, JSON.stringify(invalidEntityResponse, null, 2));
  yield fs.writeFile(duplicatedResponsePath, JSON.stringify(duplicatedEntityResponse, null, 2));

  // yield cleanData();

  return {
    validResponsePath,
    invalidResponsePath,
    duplicatedResponsePath
  };
}

/**
 * Generate Tested Validate Update Data
 * @param validateUpdateData
 * @param validateUpdateData.validEntity
 * @param validateUpdateData.hasNoIdEntity
 * @param validateUpdateData.notExistsEntity
 * @param validateUpdateData.invalidEntity
 * @param validateUpdateData.duplicatedKeyEntity
 */
export function* generateValidateUpdateData(schema, endPoint, entities, validateUpdateData, output) {
  yield generateInitialData(schema, entities);

  const validEntityResponse = yield createValidateUpdatePromise(endPoint, validateUpdateData.validEntity);
  const hasNoIdEntityResponse = yield createValidateUpdatePromise(endPoint, validateUpdateData.hasNoIdEntity);
  const notExistsEntityResponse = yield createValidateUpdatePromise(endPoint, validateUpdateData.notExistsEntity);
  const invalidEntityResponse = yield createValidateUpdatePromise(endPoint, validateUpdateData.invalidEntity);
  const duplicatedEntityResponse = yield createValidateUpdatePromise(endPoint, validateUpdateData.duplicatedKeyEntity);

  yield cleanData();

  const updateFolder = path.resolve(output, 'update');
  yield fs.mkdirp(updateFolder);

  const validResponsePath = path.resolve(updateFolder, '01-valid-response.json');
  const hasNoIdResponsePath = path.resolve(updateFolder, '02-has-no-id-response.json');
  const notExistsResponsePath = path.resolve(updateFolder, '03-not-exists-response.json');
  const invalidResponsePath = path.resolve(updateFolder, '04-invalid-response.json');
  const duplicatedResponsePath = path.resolve(updateFolder, '05-duplicated-response.json');

  yield fs.writeFile(validResponsePath, JSON.stringify(validEntityResponse, null, 2));
  yield fs.writeFile(hasNoIdResponsePath, JSON.stringify(hasNoIdEntityResponse, null, 2));
  yield fs.writeFile(notExistsResponsePath, JSON.stringify(notExistsEntityResponse, null, 2));
  yield fs.writeFile(invalidResponsePath, JSON.stringify(invalidEntityResponse, null, 2));
  yield fs.writeFile(duplicatedResponsePath, JSON.stringify(duplicatedEntityResponse, null, 2));

  return {
    validResponsePath,
    hasNoIdResponsePath,
    notExistsResponsePath,
    invalidResponsePath,
    duplicatedResponsePath
  };
}

/**
 *
 * @param removeData
 * @param removeData.validId
 * @param removeData.noId
 * @param removeData.notExistsId
 */
export function* generateRemoveData(schema, endPoint, entities, removeData, output) {

  yield generateInitialData(schema, entities);

  const validResponse = yield createRemovePromise(endPoint, removeData.validId);
  const hasNoIdResponse = yield createRemovePromise(endPoint, removeData.noId);
  const notExistsIdResponse = yield createRemovePromise(endPoint, removeData.notExistsId);

  yield cleanData();

  const deleteFolder = path.resolve(output, 'delete');
  yield fs.mkdirp(deleteFolder);

  const validResponsePath = path.resolve(deleteFolder, '01-valid-response.json');
  const hasNoIdResponsePath = path.resolve(deleteFolder, '02-has-no-id-response.json');
  const notExistsResponsePath = path.resolve(deleteFolder, '03-not-exists-id-response.json');

  yield fs.writeFile(validResponsePath, JSON.stringify(validResponse, null, 2));
  yield fs.writeFile(hasNoIdResponsePath, JSON.stringify(hasNoIdResponse, null, 2));
  yield fs.writeFile(notExistsResponsePath, JSON.stringify(notExistsIdResponse, null, 2));

  return {
    validResponsePath,
    hasNoIdResponsePath,
    notExistsResponsePath
  };
}

/**
 *
 * @param endPoint
 * @param entities
 * @param addChildData
 * @param addChildData.validRequest
 * @param addChildData.validRequest.parentId
 * @param addChildData.validRequest.field
 * @param addChildData.validRequest.child
 * @param addChildData.invalidChildRequest
 * @param addChildData.invalidChildRequest.parentId
 * @param addChildData.invalidChildRequest.field
 * @param addChildData.invalidChildRequest.child
 * @param addChildData.noParentIdRequest
 * @param addChildData.noParentIdRequest.parentId
 * @param addChildData.noParentIdRequest.field
 * @param addChildData.noParentIdRequest.child
 * @param addChildData.notExistsParentIdRequest
 * @param addChildData.notExistsParentIdRequest.parentId
 * @param addChildData.notExistsParentIdRequest.field
 * @param addChildData.notExistsParentIdRequest.child
 * @param addChildData.invalidFieldRequest
 * @param addChildData.invalidFieldRequest.parentId
 * @param addChildData.invalidFieldRequest.field
 * @param addChildData.invalidFieldRequest.child
 * @param {String} output
 */
export function* generateAddChildData(schema, endPoint, entities, addChildData, output) {

  yield generateInitialData(schema, entities);

  const validResponse = yield createAddChildPromise(endPoint, addChildData.validRequest);
  const invalidChildResponse = yield createAddChildPromise(endPoint, addChildData.invalidChildRequest);
  const noParentIdResponse = yield createAddChildPromise(endPoint, addChildData.noParentIdRequest);
  const notExistsParentIdResponse = yield createAddChildPromise(endPoint, addChildData.notExistsParentIdRequest);
  const invalidFieldResponse = yield createAddChildPromise(endPoint, addChildData.invalidFieldRequest);

  yield cleanData();

  const addChildFolder = path.resolve(output, 'add-child');
  yield fs.mkdirp(addChildFolder);

  const validResponsePath = path.resolve(addChildFolder, '01-valid-response.json');
  const invalidChildResponsePath = path.resolve(addChildFolder, '02-invalid-child-response.json');
  const hasNoParentIdResponsePath = path.resolve(addChildFolder, '03-no-parent-id-response.json');
  const notExistsParentIdResponsePath = path.resolve(addChildFolder, '04-not-exists-parent-id-response.json');
  const invalidFieldResponsePath = path.resolve(addChildFolder, '05-invalid-field-response.json');

  yield fs.writeFile(validResponsePath, JSON.stringify(validResponse, null, 2));
  yield fs.writeFile(invalidChildResponsePath, JSON.stringify(invalidChildResponse, null, 2));
  yield fs.writeFile(hasNoParentIdResponsePath, JSON.stringify(noParentIdResponse, null, 2));
  yield fs.writeFile(notExistsParentIdResponsePath, JSON.stringify(notExistsParentIdResponse, null, 2));
  yield fs.writeFile(invalidFieldResponsePath, JSON.stringify(invalidFieldResponse, null, 2));

  return {
    validResponsePath,
    invalidChildResponsePath,
    hasNoParentIdResponsePath,
    notExistsParentIdResponsePath
  };
}

/**
 *
 * @param endPoint
 * @param entities
 * @param removeChildData
 * @param removeChildData.validRequest
 * @param removeChildData.validRequest.parentId
 * @param removeChildData.validRequest.field
 * @param removeChildData.validRequest.childId
 * @param removeChildData.noParentIdRequest
 * @param removeChildData.noParentIdRequest.parentId
 * @param removeChildData.noParentIdRequest.field
 * @param removeChildData.noParentIdRequest.childId
 * @param removeChildData.noChildIdRequest
 * @param removeChildData.noChildIdRequest.parentId
 * @param removeChildData.noChildIdRequest.field
 * @param removeChildData.noChildIdRequest.childId
 * @param removeChildData.notExistsParentIdRequest
 * @param removeChildData.notExistsParentIdRequest.parentId
 * @param removeChildData.notExistsParentIdRequest.field
 * @param removeChildData.notExistsParentIdRequest.childId
 * @param removeChildData.notExistsChildIdRequest
 * @param removeChildData.notExistsChildIdRequest.parentId
 * @param removeChildData.notExistsChildIdRequest.field
 * @param removeChildData.notExistsChildIdRequest.childId
 * @param removeChildData.invalidFieldRequest
 * @param removeChildData.invalidFieldRequest.parentId
 * @param removeChildData.invalidFieldRequest.field
 * @param removeChildData.invalidFieldRequest.child
 * @param {String} output
 */
export function* generateRemoveChildData(schema, endPoint, entities, removeChildData, output) {

  yield generateInitialData(schema, entities);

  const validResponse = yield createRemoveChildPromise(endPoint, removeChildData.validRequest);
  const noParentIdResponse = yield createRemoveChildPromise(endPoint, removeChildData.noParentIdRequest);
  const notExistsParentIdResponse = yield createRemoveChildPromise(endPoint, removeChildData.notExistsParentIdRequest);
  const noChildIdResponse = yield createRemoveChildPromise(endPoint, removeChildData.noChildIdRequest);
  const notExistsChildIdResponse = yield createRemoveChildPromise(endPoint, removeChildData.notExistsChildIdRequest);
  const invalidFieldResponse = yield createAddChildPromise(endPoint, removeChildData.invalidFieldRequest);

  yield cleanData();

  const removeChildFolder = path.resolve(output, 'remove-child');
  yield fs.mkdirp(removeChildFolder);

  const validResponsePath = path.resolve(removeChildFolder, '01-valid-response.json');
  const noParentIdResponsePath = path.resolve(removeChildFolder, '02-no-parent-id-response.json');
  const notExistsParentIdResponsePath = path.resolve(removeChildFolder, '03-not-exists-parent-id-response.json');
  const noChildIdResponsePath = path.resolve(removeChildFolder, '04-no-child-id-response.json');
  const notExistsChildIdResponsePath = path.resolve(removeChildFolder, '05-not-exists-child-id-response.json');
  const invalidFieldResponsePath = path.resolve(removeChildFolder, '06-invalid-field-response.json');

  yield fs.writeFile(validResponsePath, JSON.stringify(validResponse, null, 2));
  yield fs.writeFile(noParentIdResponsePath, JSON.stringify(noParentIdResponse, null, 2));
  yield fs.writeFile(notExistsParentIdResponsePath, JSON.stringify(notExistsParentIdResponse, null, 2));
  yield fs.writeFile(noChildIdResponsePath, JSON.stringify(noChildIdResponse, null, 2));
  yield fs.writeFile(notExistsChildIdResponsePath, JSON.stringify(notExistsChildIdResponse, null, 2));
  yield fs.writeFile(invalidFieldResponsePath, JSON.stringify(invalidFieldResponse, null, 2));

  return {
    validResponsePath,
    noParentIdResponsePath,
    notExistsParentIdResponsePath,
    noChildIdResponsePath,
    notExistsChildIdResponsePath,
    invalidFieldResponsePath
  };
}

/**
 * Generate Test data for a specific type & print the result to output folder
 * @param endPoint
 * @param data - Test Data
 * @param data.entities
 * @param data.queryData
 * @param data.insertData
 * @param data.validateUpdateData
 * @param data.removeData
 * @param data.addChildData
 * @param data.removeChildData
 * @param {String} output - a folder path
 * @returns {*}
 */
export default function* generateTestData(schema, endPoint, data, output) {
  const queryData = yield generateQueryData(schema, endPoint, data.entities, data.queryData, output);
  console.log(queryData);

  const insertData = yield generateInsertData(schema, endPoint, data.entities, data.insertData, output);
  console.log(insertData);

  const updateData = yield generateValidateUpdateData(schema, endPoint, data.entities, data.validateUpdateData, output);
  console.log(updateData);

  const removeData = yield generateRemoveData(schema, endPoint, data.entities, data.removeData, output);
  console.log(removeData);

  const addChildData = yield generateAddChildData(schema, endPoint, data.entities, data.addChildData, output);
  console.log(addChildData);

  const removeChildData = yield generateRemoveChildData(schema, endPoint, data.entities, data.removeChildData, output);
  console.log(removeChildData);

  // Write Query Response
  // Clean up mongoose data & reset up
  return output;
}
