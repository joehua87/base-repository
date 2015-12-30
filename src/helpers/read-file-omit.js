import path from 'path';
import fs from 'co-fs-extra';
import dateReviver from './../json-date-reviver';
import omitNested from './omit-nested';

export default function* readFileOmit(filePath, props = ['_id', 'createdTime', 'modifiedTime']) {
  const json = yield fs.readFile(filePath);
  const result = JSON.parse(json, dateReviver);
  return omitNested(result, props);
}
