import fs from 'fs'
import { Converter } from 'csvtojson'

export default function readFromCsv(filePath) {
  return new Promise((resolve) => {
    const fileStream = fs.createReadStream(filePath, 'utf8')
    const converter = new Converter({ constructResult: true })
    converter.on('end_parsed', (obj) => {
      resolve(obj)
    })
    fileStream.pipe(converter)
  })
}
