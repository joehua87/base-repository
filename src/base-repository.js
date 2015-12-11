import moment from 'moment';
import __ from 'lodash';
import * as constant from './constants';


export default class BaseRepository {
  /**
   *
   * @param Model
   * @param {RepositoryConfig} config
   */
  constructor(Model, config) {
    this._Model = Model;
    this._config = config;
  }

  * insert(entities) {
    const response = yield this._Model.create(entities);
    return Array.isArray(response) ? response.map(entity => entity.toObject()) : response.toObject();
  }

  * getByKey(key, projection = this._config.detailProjection) {
    const filter = {};
    filter[this._config.key] = key;
    return yield this._Model.findOne(filter).select(projection).lean();
  }

  * getById(id) {
    return yield this._Model.findOne({_id: id}).lean();
  }

  * getOne(filter) {
    const condition = this.processFilter(filter, this._config);
    const entity = yield this._Model.find(condition).lean();
    return entity;
  }

  * query(filter = {}, select = {
    projection: this._config.queryProjection,
    sort: this._config.defaultSort,
    page: 1,
    limit: this._config.defaultLimit
  }) {
    const condition = this.processFilter(filter, this._config);
    const { projection, sort, page, limit} = select;

    const count = yield this._Model.count(condition);
    const entities = yield this._Model.find(condition).select(projection).sort(sort).skip((page - 1) * limit).limit(limit).lean();
    return {count, entities, sort, page, limit};
  }

  * all(filter = {}, projection = this._config.queryProjection, sort = this._config.defaultSort) {
    const condition = this.processFilter(filter, this._config);
    const count = yield this._Model.count(condition);
    const entities = yield this._Model.find(condition).select(projection).sort(sort).lean();
    return {count, entities, sort};
  }

  * updateWithValidate(_id, item) {
    let entity = yield this._Model.findOne(_id);
    entity = Object.assign(entity, item);
    yield entity.save();
    return entity;
  }

  * update(_id, item) {
    delete item._id;
    const entity = yield this._Model.update({_id}, {$set: item});
    return entity;
  }

  * deleteById(_id) {
    return yield this._Model.remove({_id: _id});
  }

  * deleteByKey(keyValue) {
    const condition = {};
    condition[this._config.key] = keyValue;
    return yield this._Model.remove(condition);
  }

  * addChild(_id, field, item) {
    const setToAdd = {};
    // will return {tags: item} if field = 'tags';
    setToAdd[field] = item;
    return yield this._Model.update({_id}, {$addToSet: setToAdd});
  }

  * removeChild(_id, field, itemId) {
    const condition = {};
    condition[field] = {_id: itemId};
    return yield this._Model.update({_id}, {$pull: condition});
  }

  /**
   *
   * @param filter
   */
  processFilter(filter) {
    const result = {};
    for (const item of this._config.fields) {
      let value = filter[item.filterField];

      if (!value || value.toString() === '') {
        continue;
      }

      // Validate Value
      switch (item.dbType) {
        case constant.STRING:
          if (typeof value !== 'string') {
            throw new Error(`${value} is not a valid String`);
          }
          break;

        case constant.INTEGER:
          value = parseInt(value, 10);
          if (!Number.isInteger(value)) {
            throw new Error(`${value} is not a valid Number`);
          }
          break;

        case constant.FLOAT:
          value = parseFloat(value);
          if (isNaN(value)) {
            throw new Error(`${value} is not a valid Float`);
          }
          break;

        case constant.STRING_ARRAY:
          if (!Array.isArray(value)) {
            throw new Error(`${value} is not a valid Array`);
          }

          for (const ele of value) {
            if (typeof ele !== 'string') {
              throw new Error(`${ele} is not a valid String`);
            }
          }
          break;
        case constant.INTEGER_ARRAY:
          if (!Array.isArray(value)) {
            throw new Error(`${value} is not a valid Array`);
          }

          value = value.map(ele => parseInt(ele, 10));

          if (__.any(value, ele => !Number.isInteger(ele))) {
            throw new Error(`Cannot parse ${value} into array of integer`);
          }
          break;

        case constant.FLOAT_ARRAY:
          if (!Array.isArray(value)) {
            throw new Error(`${value} is not a valid Array`);
          }

          value = value.map(ele => parseFloat(ele));

          if (__.any(value, ele => isNaN(ele))) {
            throw new Error(`Cannot parse ${value} into array of integer`);
          }
          break;

        case constant.BOOLEAN:
          value = value.toString().toLowerCase() === 'true';
          if (value !== true && value !== false) {
            throw new Error(`${value} is not a valid Boolean`);
          }
          break;

        case constant.DATE:
          value = moment(value, this._config.defaultDateFormat);
          if (!value.isValid()) {
            throw new Error(`${value} is not a valid Date`);
          }
          break;
        default:
          throw new Error('dbType must be in STRING, INTEGER, FLOAT, DATE or BOOLEAN, STRING_ARRAY, INTEGER_ARRAY, FLOAT_ARRAY');
      }

      // Process Data
      switch (item.compareType) {
        case constant.EQUAL:
          result[item.dbField] = value;
          break;
        case constant.GT:
          result[item.dbField] = {...result[item.dbField], $gt: value};
          break;
        case constant.GTE:
          result[item.dbField] = {...result[item.dbField], $gte: value};
          break;
        case constant.LT:
          result[item.dbField] = {...result[item.dbField], $lt: value};
          break;
        case constant.LTE:
          result[item.dbField] = {...result[item.dbField], $lte: value};
          break;
        case constant.REG_EX:
          result[item.dbField] = new RegExp(value);
          break;
        case constant.REG_EX_I:
          result[item.dbField] = new RegExp(value, 'i');
          break;
        case constant.EXISTS:
          result[item.dbField] = {...result[item.dbField], $exists: value};
          break;
        case constant.FULL_TEXT:
          result.$text = {$search: value};
          break;
        case constant.CONTAIN:
          result[item.dbField] = {$in: value};
          break;

        default:
          throw new Error('compareType must be in EQUAL, GT, GTE, LT, LTE, REG_EX, REG_EX_I, FULL_TEXT, EXISTS');
      }
    }
    return result;
  }
}

/**
 * @typedef {Object} RepositoryConfig
 * @property {String} key
 * @property {FilterFieldConfig[]} fields
 * @property {Number} defaultLimit
 * @property {String} queryProjection
 * @property {String} detailProjection
 * @property {String} defaultDateFormat - Default to YYYY-MM-DD HH:mm
 */

/**
 * @typedef {Object} FilterFieldConfig
 * @property {String} filterField
 * @property {String} dbField
 * @property {String} compareType -  must be in EQUAL, GT, GTE, LT, LTE, REG_EX, REG_EX_I, FULL_TEXT, EXISTS
 * @property {String} dbType -  must be in STRING, DATE, INTEGER, FLOAT, BOOLEAN
 */
