/**
 * Support JSON.parse Function, automatically parse field that have JSON Date String Format to Date type
 * @param key
 * @param value
 * @returns {*}
 */
export default function dateReviver(key, value) {
  let tmp
  if (typeof value === 'string') {
    tmp = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value)
    if (tmp) {
      return new Date(value)
    }
  }
  return value
}
