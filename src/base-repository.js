import moment from 'moment'
import slugify from 'slug'
import __ from 'lodash'
import * as constant from './constants'

const debug = require('debug')('base-repository:base-repository')
const processQueryDebug = require('debug')('base-repository:base-repository:process-query')

export default class BaseRepository {
  // TODO Refactor this to accept schemaDefinition
  /**
   *
   * @param Model
   * @param {RepositoryConfig} config
   */
  constructor(Model, config) {
    this._Model = Model
    this._config = config
  }

  getConfig() {
    return this._config
  }

  getSchema() {
    return this._Model.schema
  }

  insert(entities) {
    return this._Model.create(entities).then((response) =>
      Array.isArray(response) ? response.map(entity => entity.toObject()) : response.toObject()
    )
  }

  async findName(filter = {}) {
    const { slugField, nameField, prefix } = this._config.createOption
    const slugPrefix = slugify(prefix, { lower: true })
    const condition = {
      ...filter,
      slug: new RegExp(`^${slugPrefix}-\\d+`)
    }

    const entities = await this._Model.find(condition).select(slugField).lean()
    const slugs = __(entities).pluck(slugField).map(slug => parseInt(slug.replace(new RegExp(`${slugPrefix}-`), ''), 0)).value()
    let newIdx = 1
    if (slugs.length > 0) {
      newIdx = __.max(slugs) + 1
    }

    return {
      [slugField]: `${slugPrefix}-${newIdx}`,
      [nameField]: `${prefix} ${newIdx}`
    }
  }

  async create(filter = {}, overrideEntity = {}) {
    const entity = await this.findName(filter)
    return await this.insert({ ...this._config.defaultEntity, ...filter, ...entity, ...overrideEntity })
  }

  getByKey(key, projection = this._config.detailProjection) {
    return this._Model.findOne({ [this._config.key]: key }).select(projection).lean()
  }

  getById(_id, projection = this._config.detailProjection) {
    return this._Model.findOne({ _id }).select(projection).lean()
  }

  getByIds(ids, projection = this._config.detailProjection) {
    return this._Model.find({ _id: { $in: [ids] } }).select(projection).lean()
  }

  getByFilter(filter = {}, selection = {}) {
    const select = {
      projection: this._config.detailProjection,
      sort: this._config.defaultSort,
      ...selection
    }

    debug(`getByFilter - Api Filter`, filter)
    debug(`getByFilter - Api Select`, select)

    const { projection, sort } = select
    const condition = this.processFilter(filter || {}, this._config)
    debug(`getByFilter - Mongoose Filter`, condition)
    return this._Model.findOne(condition).select(projection).sort(sort).lean()
  }

  async query(filter = {}, selection = {}) {
    const select = {
      projection: this._config.queryProjection,
      sort: this._config.defaultSort,
      page: 1,
      limit: this._config.defaultLimit,
      getAll: false,
      ...selection
    }

    debug(`query - Api Filter`, filter)
    debug(`query - Api Select`, select)

    const { projection, sort, page, limit, getAll } = select
    const condition = this.processFilter(filter || {}, this._config)
    debug(`query - Mongoose Filter`, condition)

    const count = await this._Model.count(condition)

    let query = this._Model.find(condition).select(projection).sort(sort)
    if (!getAll) {
      query = query.skip((page - 1) * limit).limit(limit).lean()
    }

    const entities = await query

    if (getAll) {
      return { count, entities, filter, sort, projection }
    }
    return { count, entities, filter, sort, projection, page, limit }
  }

  async all(filter = {}, select) {
    const condition = this.processFilter(filter, this._config)

    const defaultSelect = {
      projection: this._config.queryProjection,
      sort: this._config.defaultSort
    }

    const { projection, sort } = { ...defaultSelect, ...select }

    const count = await this._Model.count(condition)
    const entities = await this._Model.find(condition).select(projection).sort(sort).lean()
    return { count, entities, filter, sort }
  }

  async validateUpdate(_id, item) {
    let entity = await this._Model.findOne({ _id })
    if (!entity) {
      throw new Error('Entity not exists')
    }
    entity = Object.assign(entity, item)
    await entity.save()
    return entity
  }

  update({ _id, ...item }) {
    return this._Model.update({ _id }, { $set: item })
  }

  async deleteById(_id) {
    const entity = await this._Model.findOne({ _id }).select('_id')
    if (!entity) {
      throw new Error('Not exists entity')
    }
    await this._Model.remove({ _id })
    return entity
  }

  deleteByKey(keyValue) {
    const condition = {}
    condition[this._config.key] = keyValue
    return this._Model.remove(condition)
  }

  async addChild(_id, field, item) {
    const parent = await this._Model.findOne({ _id }).select(field)
    if (!parent) {
      throw new Error('Not exists parent')
    }

    const child = parent[field].create(item)
    parent[field].push(child)
    await parent.save()
    return child
  }

  async removeChild(_id, field, itemId) {
    const parent = await this._Model.findOne({ _id }).select(field)

    if (!parent) {
      throw new Error('Not exists parent')
    }

    const child = parent[field].id(itemId)

    if (!child) {
      throw new Error('Not exists child')
    }

    child.remove()
    await parent.save()
    return child
  }

  /**
   *
   * @param filter
   */
  processFilter(filter) {
    const result = {}
    for (const item of this._config.fields) {
      let value = filter[item.filterField]

      if (!value || value.toString() === '') {
        continue
      }

      processQueryDebug(`Db Type`, item.dbType)
      processQueryDebug(`Compare Type`, item.compareType)

      // Validate Value
      switch (item.dbType) {
        case constant.STRING:
          if (typeof value !== 'string') {
            throw new Error(`${value} is not a valid String`)
          }
          break

        case constant.INTEGER:
          value = parseInt(value, 10)
          if (!Number.isInteger(value)) {
            throw new Error(`${value} is not a valid Number`)
          }
          break

        case constant.FLOAT:
          value = parseFloat(value)
          if (isNaN(value)) {
            throw new Error(`${value} is not a valid Float`)
          }
          break

        case constant.STRING_ARRAY:
          if (typeof value === 'string') value = [value]
          if (!Array.isArray(value)) {
            throw new Error(`${value} is not a valid String Array`)
          }

          for (const ele of value) {
            if (typeof ele !== 'string') {
              throw new Error(`${ele} is not a valid String`)
            }
          }
          break
        case constant.INTEGER_ARRAY:
          if (typeof value === 'number') value = [value]
          if (!Array.isArray(value)) {
            throw new Error(`${value} is not a valid Number Array`)
          }

          value = value.map(ele => parseInt(ele, 10))

          if (__.any(value, ele => !Number.isInteger(ele))) {
            throw new Error(`Cannot parse ${value} into array of integer`)
          }
          break

        case constant.FLOAT_ARRAY:
          if (typeof value === 'number') value = [value]
          if (!Array.isArray(value)) {
            throw new Error(`${value} is not a valid Number Array`)
          }

          value = value.map(ele => parseFloat(ele))

          if (__.any(value, ele => isNaN(ele))) {
            throw new Error(`Cannot parse ${value} into array of integer`)
          }
          break

        case constant.BOOLEAN:
          value = value.toString().toLowerCase() === 'true'
          if (value !== true && value !== false) {
            throw new Error(`${value} is not a valid Boolean`)
          }
          break

        case constant.DATE:
          value = moment(value, this._config.defaultDateFormat)
          if (!value.isValid()) {
            throw new Error(`${value} is not a valid Date`)
          }
          break
        default:
          throw new Error('dbType must be in STRING, INTEGER, FLOAT, DATE or BOOLEAN, STRING_ARRAY, INTEGER_ARRAY, FLOAT_ARRAY')
      }

      // Process Data
      switch (item.compareType) {
        case constant.EQUAL:
          result[item.dbField] = value
          break
        case constant.GT:
          result[item.dbField] = { ...result[item.dbField], $gt: value }
          break
        case constant.GTE:
          result[item.dbField] = { ...result[item.dbField], $gte: value }
          break
        case constant.LT:
          result[item.dbField] = { ...result[item.dbField], $lt: value }
          break
        case constant.LTE:
          result[item.dbField] = { ...result[item.dbField], $lte: value }
          break
        case constant.REG_EX:
          result[item.dbField] = new RegExp(value)
          break
        case constant.REG_EX_I:
          result[item.dbField] = new RegExp(value, 'i')
          break
        case constant.EXISTS:
          result[item.dbField] = { ...result[item.dbField], $exists: value }
          break
        case constant.FULL_TEXT:
          result.$text = { $search: value }
          break
        case constant.CONTAIN:
          result[item.dbField] = { $in: value }
          break

        default:
          throw new Error('compareType must be in EQUAL, GT, GTE, LT, LTE, REG_EX, REG_EX_I, FULL_TEXT, EXISTS')
      }
    }
    return result
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
 * @property {Object} createOption
 * @property {Object} defaultEntity
 */

/**
 * @typedef {Object} FilterFieldConfig
 * @property {String} filterField
 * @property {String} dbField
 * @property {String} compareType -  must be in EQUAL, GT, GTE, LT, LTE, REG_EX, REG_EX_I, FULL_TEXT, EXISTS
 * @property {String} dbType -  must be in STRING, DATE, INTEGER, FLOAT, BOOLEAN
 */
