import { omit } from 'lodash';

export default function omitNested(obj, omitKeys) {

  const keys = Object.keys(obj);

  for (const key of keys) {
    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(item => omitNested(item, omitKeys));
    } else if (typeof obj[key] === 'object') {
      obj[key] = omitNested(obj[key], omitKeys);
    }
  }

  return omit(obj, omitKeys);
}
