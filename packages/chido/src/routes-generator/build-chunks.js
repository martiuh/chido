// RUN all the React components in the pages folder and build a Router
const fse = require('fs-extra')
const fs = require('fs')
const path = require('path')
const slash = require('slash')
const kebabCase = require('lodash/kebabCase')

const report = require('../report/index')
const jsMatch = require('../../app-dir/utils/jsMatch')

const currentDir = process.cwd()
const routesDir = path.join(currentDir, '/.app/routes')
if (!fs.existsSync(routesDir)) {
  fse.ensureDirSync(routesDir)
}

const buildchido = () => {
  const pagePath = path.join(currentDir, '/src/pages')
  if (!fse.existsSync(pagePath)) {
    return report.failure('make sure you have a working /src/pages')
  }

  let importChunks = ''
  let requireChunks = ''
  let fileRouter = ''
  const files = []
  const filesArr = fs.readdirSync(pagePath)
  const default404 = slash(path.join(currentDir, '/.app/404/default-404.js'))
  const has404 = !!filesArr.find(P => P === '404.js')
  filesArr.forEach(P => {
    if (jsMatch(P)) {
      const fullPath = slash(path.join(pagePath, P))
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

  if (!has404) {
    const chunkName404 = `site--pages-${kebabCase('404.js')}`
    importChunks = `${importChunks}
      "${chunkName404}": import("${default404}"/* webpackChunkName: "${chunkName404}" */),`

    requireChunks = `${requireChunks}
      "${chunkName404}": require("${slash(default404)}"),`

    fileRouter = `${fileRouter}
      "${chunkName404}": "404/",`
  }

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

module.exports = buildchido
if (require.main === module) {
  buildchido()
}
