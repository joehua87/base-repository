import { omit } from 'lodash'

export default function nestOmit(obj:Object | Array, omitKeys:Array<string>) {
  if (Array.isArray(obj)) {
    return nestOmit({ obj }, omitKeys).obj
  }

  const result = Object.assign({}, obj)
  const keys = Object.keys(result)

  for (const key of keys) {
    if (Array.isArray(result[key])) {
      result[key] = result[key].map(item => nestOmit(item, omitKeys))
    } else if (typeof result[key] === 'object') {
      result[key] = nestOmit(result[key], omitKeys)
    }
  }

  return omit(result, omitKeys)
}
