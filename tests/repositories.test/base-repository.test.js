import mongoose from 'mongoose';
import __ from 'lodash';
import co from 'co';
import path from 'path';
import uuid from 'uuid';

import BaseRepository from '../../src/base-repository';
import * as articleSchema from '../_app/article.model.js';

import readFileOmit from '../../src/helpers/read-file-omit';

const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;

const entities = require('./test-data/entities.json');
const Article = mongoose.model(articleSchema.schemaName, articleSchema.schema);

function configSetupAndTearDown() {
  before((done) => {
    const collection = uuid.v4();
    const host = `mongodb://localhost/${collection}`;
    mongoose.connect(host, () => {
      const Model = mongoose.model(articleSchema.schemaName, articleSchema.schema);
      Model.create(entities, done);
    });
  });

  after((done) => {
    mongoose.connection.db.dropDatabase();
    mongoose.connection.close(done);
  });
}


describe('Base Repository', () => {

  const repository = new BaseRepository(Article, articleSchema.config);

  describe('Query', () => {
    configSetupAndTearDown();

    it('1. Default filter & select', co.wrap(function* () {
      const response = yield repository.query();
      const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/result-1.json'));
      // console.log(JSON.stringify(response, null, 2));
      expect(response).to.containSubset(expectResult);
      // To prevent subset return true if expectResult.length < response.length
      expect(response.length).to.equal(expectResult.length);
    }));

    it('2. Filter equal String', co.wrap(function* () {
      const filter = {
        tag: 'gain-muscle'
      };

      // const response = yield repository.query(filter, {projection: articleSchema.config.queryProjection + ' -_id tags.name tags.slug'});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(filter);
      const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/result-2.json'));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('3. Filter RegEx String', co.wrap(function* () {
      const filter = {
        slug: 'commodi-et'
      };

      // const response = yield repository.query(filter, {projection: articleSchema.config.queryProjection + ' -_id tags.name tags.slug'});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(filter);
      const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/result-3.json'));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('4. Filter RegEx Insensitive String', co.wrap(function* () {
      const filter = {
        title: 'Ea CONsectEtur'
      };

      // const response = yield repository.query(filter, {projection: articleSchema.config.queryProjection + ' -_id tags.name tags.slug'});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(filter);
      const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/result-4.json'));
      expect(response).to.containSubset(expectResult);
    }));

    it('5. Paging', co.wrap(function* () {
      const select = {
        page: 5,
        limit: 5
      };

      // const response = yield repository.query(undefined, {projection: articleSchema.config.queryProjection + ' -_id tags.name tags.slug', ...select});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(null, select);
      const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/result-5.json'));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('6. Projection', co.wrap(function* () {
      const select = {
        projection: 'title slug'
      };

      // const select = { projection: 'title slug -_id'};
      // const response = yield repository.query(undefined, {projection: articleSchema.config.queryProjection + ' -_id tags.name tags.slug', ...select});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(null, select);
      const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/result-6.json'));
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

      // const response = yield repository.query(filter, {projection: articleSchema.config.queryProjection + ' -_id tags.name tags.slug', ...select});
      // console.log('Response', JSON.stringify(response, null, 2));

      const response = yield repository.query(filter, select);
      const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/result-7.json'));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    it('8. Get all (return all entities)', co.wrap(function* () {
      const select = {
        projection: 'title slug -_id',
        getAll: true
      };

      const response = yield repository.query(null, select);
      const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/result-8.json'));
      expect(response).to.containSubset(expectResult);
      expect(response.length).to.equal(expectResult.length);
    }));

    describe('Get one', () => {
      it('by _id', co.wrap(function* () {
        const entity = yield repository.getById('567f8a571c17d9c58394970a');
        const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/get-one/result-1.json'));
        expect(entity).to.containSubset(expectResult);
      }));

      it('by key', co.wrap(function* () {
        const entity = yield repository.getByKey('voluptas-sequi-ea-83');
        const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/get-one/result-2.json'));
        expect(entity).to.containSubset(expectResult);
      }));
      it('by filter', co.wrap(function* () {
        const entity = yield repository.getByFilter({slug: 'quasi', commentUsername: 'Billy Schowalter'});
        const expectResult = yield readFileOmit(path.resolve(__dirname, './test-data/get-one/result-3.json'));
        expect(entity).to.containSubset(expectResult);
      }));
    });
  });

  describe('Add Child', () => {

    configSetupAndTearDown();

    it('Add successfully', co.wrap(function* () {
      const newChild = {
        slug: 'healthy-recipes-new',
        name: 'Healthy Recipes New'
      };
      const responseChild = yield repository.addChild('567f8a571c17d9c58394970a', 'tags', newChild);
      expect(responseChild).to.containSubset(newChild);

      const afterEntity = yield repository.getById('567f8a571c17d9c58394970a', 'tags');
      expect(__.pluck(afterEntity.tags, 'slug')).to.contains('healthy-recipes-new');
    }));
  });

  describe('Remove Child', () => {

    configSetupAndTearDown();

    it('Remove successfully', co.wrap(function* () {
      const child = yield repository.removeChild('567f8a571c17d9c58394970a', 'tags', '567f8a571c17d9c583949712');

      expect(child).to.containSubset({
        slug: 'healthy-recipes',
        name: 'Healthy Recipes'
      });

      const afterEntity = yield repository.getById('567f8a571c17d9c58394970a', 'tags');
      expect(__.pluck(afterEntity.tags, '_id')).to.not.contains('567f8a571c17d9c583949712');
    }));
  });
});
