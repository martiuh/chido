// RUN all the React components in the pages folder and build a Router
const fs = require('fs')
const path = require('path')
const slash = require('slash')
const kebabCase = require('lodash/kebabCase')

const jsMatch = require('../utils/jsMatch')

const currentDir = process.cwd()
const routesDir = path.join(currentDir, '/.app/routes')
if (!fs.existsSync(routesDir)) {
  fs.mkdirSync(routesDir)
}

const buildDinastico = () => {
  const pagePath = path.join(currentDir, '/src/pages')
  let importChunks = ''
  let requireChunks = ''
  let fileRouter = ''
  const files = []
  fs.readdirSync(pagePath).forEach(P => {
    if (jsMatch(P)) {
      const fullPath = slash(path.resolve(currentDir, pagePath, P))
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
  fs.writeFileSync(`${currentDir}/.app/routes/async-chunks.js`, importChunks)
  fs.writeFileSync(`${currentDir}/.app/routes/sync-chunks.js`, requireChunks)
  fs.writeFileSync(`${currentDir}/.app/routes/file-router.js`, fileRouter)
  return files
}

module.exports = buildDinastico
if (require.main === module) {
  buildDinastico()
}
