import moment from 'moment';
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

  * detail(key, projection = this._config.detailProjection) {
    const filter = {};
    filter[this._config.key] = key;
    return yield this._Model.findOne(filter).select(projection).lean();
  }

  * query(filter = {}, projection = this._config.queryProjection, sort = this._config.defaultSort, page = 1, limit = this._config.defaultLimit) {
    const condition = this.processFilter(filter, this._config);
    const count = yield this._Model.count(condition);
    const entities = yield this._Model.find(condition).select(projection).sort(sort).skip((page - 1) * limit).limit(limit).lean();
    return {count, entities};
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
        case constant.BOOLEAN:
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
          throw new Error('dbType must be in STRING, DATE, INTEGER, FLOAT or BOOLEAN');
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

        default:
          throw new Error('compareType must be in EQUAL, GT, GTE, LT, LTE, REG_EX, REG_EX_I, FULL_TEXT, EXISTS');
      }
    }
    return result;
  }
}

/**
 * @typedef {Object} RepositoryConfig
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
