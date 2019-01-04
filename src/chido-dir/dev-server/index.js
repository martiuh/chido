const express = require('express')
const { Server } = require('http')
const slash = require('slash')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const chokidar = require('chokidar')
const fs = require('fs')

const jsMatch = require('../utils/jsMatch')
const c = require('./socket-constants')
const DevSocket = require('./DevSocketManager')
const report = require('./report')
const webpackConfig = require('../client-webpack/client.webpack')
const buildDinastico = require('../routes-generator/build-chunks')
// check if pagesDir exists in src
const pagesDir = path.resolve(__dirname, '../../src/pages')
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
  report.failure('cannot build dinastico router')
}

report.success('router build!!!')

const app = express()
const httpApp = Server(app)
DevSocket.init(httpApp)

const Start = () => {
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

  httpApp.listen(PORT, () => report.success(`app is running in localhost:${PORT}`))
}

const clientCompiler = webpack(clientConfig)
const devMiddleware = webpackDevMiddleware(clientCompiler, {
  publicPath
})

app.use(devMiddleware)
devMiddleware.waitUntilValid(Start)

app.use(hotMiddleware(clientCompiler, {
  log: false,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}))

app.use(publicPath, express.static(outputPath))
app.use('/*', (req, res) => res.sendFile(path.resolve(__dirname, '../../public/index.html')))
