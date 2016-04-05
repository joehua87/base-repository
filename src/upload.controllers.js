import path from 'path'
import fs from 'fs'
import coFs from 'co-fs-extra'
import os from 'os'
import parse from 'co-busboy'
import { event } from 'thunkify-wrap'

const debug = require('debug')('base-repository:controller:upload')

export default function* upload(next) {
  // ignore non-POSTs
  if (this.method !== 'POST') return yield next

  // multipart upload
  const parts = parse(this)
  let part

  this.files = []
  const promises = []

  const folder = path.join(os.tmpdir(), Math.random().toString())
  yield coFs.mkdirp(folder)

  this.fields = []

  while (part = yield parts) {
    if (!part.filename) {
      // If part is not file, it's a field, so store it into this.fields to consume later
      this.fields[part[0]] = part[1]
      continue
    }

    const file = path.join(folder, part.filename)
    this.files.push(file)
    debug('Got file', file)
    const stream = fs.createWriteStream(file)
    promises.push(event(stream, 'end'))
    part.pipe(stream)
  }

  debug('Got field', this.fields)

  yield Promise.all(promises)
  debug('Upload successfully')

  yield next

  // Delete temp file after complete
  yield coFs.remove(folder)
  delete this.files
}
