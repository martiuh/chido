// RUN all the React components in the pages folder and build a Router
const fs = require('fs')
const path = require('path')
const slash = require('slash')
const kebabCase = require('lodash/kebabCase')
const jsMatch = require('../utils/jsMatch')

fs.mkdirSync(path.join(__dirname, '../routes'))
const buildDinastico = () => {
  const currentDir = __dirname
  const pagePath = path.join(currentDir, '../../src/pages')
  let importChunks = ''
  let requireChunks = ''
  let fileRouter = ''
  const files = []
  fs.readdirSync(pagePath).forEach(P => {
    if (jsMatch(P)) {
      const fullPath = slash(path.resolve(__dirname, pagePath, P))
      files.push(fullPath)
      const chunkName = `site--pages-${kebabCase(P)}`
      importChunks = `${importChunks}
      "${chunkName}": import("${fullPath}"/* webpackChunkName: "${chunkName}" */),`

      requireChunks = `${requireChunks}
      "${chunkName}": require("${slash(pagePath)}/${P}"),`

      fileRouter = `${fileRouter}
      "${chunkName}": "${P.split('.js')[0]}/",`
    }
  })

  importChunks = `module.exports = {${importChunks}\n}
  `
  requireChunks = `module.exports = {${requireChunks}\n}
  `
  fileRouter = `module.exports = {${fileRouter}\n}`

  fs.writeFileSync(`${currentDir}/../routes/async-chunks.js`, importChunks)
  fs.writeFileSync(`${currentDir}/../routes/sync-chunks.js`, requireChunks)
  fs.writeFileSync(`${currentDir}/../routes/file-router.js`, fileRouter)
  return files
}

module.exports = buildDinastico
if (require.main === module) {
  buildDinastico()
}
