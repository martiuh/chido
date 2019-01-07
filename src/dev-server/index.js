const express = require('express')
const { Server } = require('http')
const slash = require('slash')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const chokidar = require('chokidar')
const fs = require('fs')

const webpackConfig = require('../client-webpack/client.webpack')
const jsMatch = require('../utils/jsMatch')
const c = require('../../app-dir/socket-constants')
const DevSocket = require('./DevSocketManager')
const report = require('./report')
const buildDinastico = require('../routes-generator/build-chunks')

// check if pagesDir exists in src
const pagesDir = path.join(process.cwd(), '/src/pages')
const hasPages = fs.existsSync(pagesDir)
if (!hasPages) {
  report.failure('make sure ./src/pages folder exists')
}

const clientConfig = webpackConfig(null, { mode: 'development' })

const { publicPath } = clientConfig.output
const outputPath = clientConfig.output.path
const PORT = process.env.PORT || 3030

report.event('building router')
let initialPages = []
try {
  initialPages = buildDinastico() // This is synchronous
}
catch (e) {
  report.failure('cannot build dinastico router', new Error(e))
}

report.success('router build!!!')

const app = express()
const httpApp = Server(app)
DevSocket.init(httpApp)

const Start = () => {
  console.clear()
  const ws = DevSocket.getSocket()
  const watcher = chokidar.watch(pagesDir)
  watcher
    .on('add', file => {
      file = slash(file)
      if (!initialPages.includes(file) && jsMatch(file)) {
        report.event(`${file} was added`)
        initialPages = buildDinastico()
        ws.emit(c.RELOAD)
      }
    })
    .on('unlink', file => {
      report.warn(`${file} was removed`)
      initialPages = buildDinastico()
      ws.emit(c.RELOAD)
    })

  httpApp.listen(PORT, () => report.success(`[chido] app is in localhost:${PORT}`))
}

const clientCompiler = webpack(clientConfig)
const devMiddleware = webpackDevMiddleware(clientCompiler, {
  publicPath,
  logLevel: 'trace',
  stats: 'errors-only'
})

app.use(devMiddleware)
devMiddleware.waitUntilValid(Start)
app.use(hotMiddleware(clientCompiler, {
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}))

app.use(publicPath, express.static(outputPath))

const wildCardHtml = path.join(process.cwd(), '/public/index.html')
console.log({ wildCardHtml })
app.use('/*', (req, res) => res.sendFile(wildCardHtml))
