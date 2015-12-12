import mongoose from 'mongoose';
import co from 'co';
import path from 'path';
import fs from 'co-fs-extra';
import uuid from 'uuid';

const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;

import BaseRepository from '../src/base-repository';
import * as ArticleSchema from './article.model';

const sampleDataPath = path.resolve(__dirname, './test-data/entities.json');
const Article = mongoose.model(ArticleSchema.schemaName, ArticleSchema.schema);

const collection = uuid.v4();
mongoose.connect(`mongodb://localhost/${collection}`);

function* setupDb() {
  const json = yield fs.readFile(sampleDataPath, 'utf8');
  const entities = JSON.parse(json);
  yield Article.create(entities);
}

describe('Base Repository', () => {

  const repository = new BaseRepository(Article, ArticleSchema.config);

  describe('Query', () => {
    before(co.wrap(function* () {
      yield setupDb();
    }));

    after((done) => {
      mongoose.connection.db.dropDatabase(done);
    });

    it('1. Default filter & select', co.wrap(function* () {
      const response = yield repository.query();
      const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/result-1.json')));
      // console.log(JSON.stringify(response, null, 2));
      expect(response).to.containSubset(expectResult);
      // To prevent subset return true if expectResult.length < response.length
      expect(response.length).to.equal(expectResult.length);
    }));

    it('2. Filter equal String', co.wrap(function* () {
      const filter = {
        tag: 'gain-muscle'
      };

      // const response = yield repository.query(filter, {projection: ArticleSchema.config.queryProjection + ' -_id tags.name tags.slug'});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(filter);
      const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/result-2.json')));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('3. Filter RegEx String', co.wrap(function* () {
      const filter = {
        slug: 'commodi-et'
      };

      // const response = yield repository.query(filter, {projection: ArticleSchema.config.queryProjection + ' -_id tags.name tags.slug'});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(filter);
      const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/result-3.json')));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('4. Filter RegEx Insensitive String', co.wrap(function* () {
      const filter = {
        title: 'Ea CONsectEtur'
      };

      // const response = yield repository.query(filter, {projection: ArticleSchema.config.queryProjection + ' -_id tags.name tags.slug'});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(filter);
      const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/result-4.json')));
      expect(response).to.containSubset(expectResult);
    }));

    it('5. Paging', co.wrap(function* () {
      const select = {
        page: 5,
        limit: 5
      };

      // const response = yield repository.query(undefined, {projection: ArticleSchema.config.queryProjection + ' -_id tags.name tags.slug', ...select});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(null, select);
      const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/result-5.json')));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('6. Projection', co.wrap(function* () {
      const select = {
        projection: 'title slug'
      };

      // const select = { projection: 'title slug -_id'};
      // const response = yield repository.query(undefined, {projection: ArticleSchema.config.queryProjection + ' -_id tags.name tags.slug', ...select});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(null, select);
      const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/result-6.json')));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('7. Filter Contain String', co.wrap(function* () {
      const filter = {
        commentUsernames: ['Axel Mertz', 'Broderick Berge', 'Kaley Goldner']
      };
      const select = {
        projection: 'title slug comments.username'
      };

      // const response = yield repository.query(filter, {projection: ArticleSchema.config.queryProjection + ' -_id tags.name tags.slug', ...select});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(filter, select);
      const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/result-7.json')));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('8. Get all (return all entities)', co.wrap(function* () {
      const select = {
        projection: 'title slug -_id',
        getAll: true
      };


      // const response = yield repository.query(null, {projection: ArticleSchema.config.queryProjection + ' -_id tags.name tags.slug', ...select});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(null, select);
      const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/result-8.json')));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    describe('Get one', () => {
      it('by _id', co.wrap(function* () {
        const entity = yield repository.getById('566be3338c8f7d4a014a81ca');
        const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/get-one/result-1.json')));
        expect(entity).to.containSubset(expectResult);
      }));

      it('by key', co.wrap(function* () {
        const entity = yield repository.getByKey('voluptas-sequi-ea-83');
        const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/get-one/result-2.json')));
        expect(entity).to.containSubset(expectResult);
      }));
      it('by filter', co.wrap(function* () {
        const entity = yield repository.getByFilter({slug: 'quasi', commentUsername: 'Billy Schowalter'});
        const expectResult = JSON.parse(yield fs.readFile(path.resolve(__dirname, './test-data/get-one/result-3.json')));
        expect(entity).to.containSubset(expectResult);
      }));
    });
  });
});
