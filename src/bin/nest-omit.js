import program from 'commander'
import nestOmitFile from '../nest-omit-file'
import glob from 'glob'

const debug = require('debug')('nest-omit:cli')

function list(value) {
  return value.split(/,/).map(item => item.trim())
}

program
  .option('-f, --files <files>', 'files glob pattern')
  .option('-p, --props <props>', 'props to omit (nested)', list)
program.parse(process.argv)

console.log(program.files)
console.log(program.props)

debug('File pattern to omit', program.files)
debug('Omitted Props', program.props)

glob(require('path').resolve(process.cwd(), program.files), (err, files) => {
  debug('Files to omit', files)
  const promises = files.map((file) => nestOmitFile(file, program.props))
  Promise.all(promises).then((response) => {
    console.log(response)
  })
})
