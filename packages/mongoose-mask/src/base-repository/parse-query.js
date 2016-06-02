import * as constant from '../constants'

const debug = require('debug')('mongoose-mask:parse-query')

export default function parseQuery(query, config) {
  const result = {}
  for (const item of config.fields) {
    let value = query[item.filterField]

    if (!value || value.toString() === '') {
      continue
    }

    debug('Db Type', item.dbType)
    debug('Compare Type, item.compareType')

    // Validate Value
    switch (item.dbType) {
      case String:
        if (typeof value !== 'string') {
          throw new Error(`${value} is not a valid String`)
        }
        break

      case Number:
        value = parseFloat(value, 10)
        if (isNaN(value)) {
          throw new Error(`${value} is not a valid Number`)
        }
        break

      case Array:
        if (!Array.isArray(value)) value = [value]
        break

      case Boolean:
        value = value.toString().toLowerCase() === 'true'
        if (value !== true && value !== false) {
          throw new Error(`${value} is not a valid Boolean`)
        }
        break

      case Date:
        value = new Date(value)
        if (isNaN(!value.getTime())) {
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
