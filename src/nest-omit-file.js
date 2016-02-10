import fs from 'fs-extra'
import Promise from 'bluebird'
import nestOmit from './nest-omit'

const debug = require('debug')('nest-omit:core')
const writeFile = Promise.promisify(fs.writeFile)

export default function omitPropsInFile(filePath:String, omittedProps:Array<String>):Promise {
  debug('File Path', filePath)
  const result = nestOmit(require(filePath), omittedProps)
  return writeFile(filePath, JSON.stringify(result, null, 2))
}
