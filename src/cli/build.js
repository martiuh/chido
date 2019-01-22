const webpack = require('webpack')
const ensureDirs = require('./ensureDirs')

const report = require('../report')
const routesWebpack = require('../routes-generator/routes.webpack')
const clientWebpack = require('../client-webpack/client.webpack')
const staticHtmlWebpack = require('../html-generator/html.webpack')
const wireHtaccess = require('../custom-router/wire-htaccess')

const promiseWebpack = config => new Promise((resolve, reject) => {
  webpack(config, (err, stats = { compilation: {} }) => {
    const routesErr = stats.compilation.errors
    if (err || routesErr.length > 0) {
      return reject(err || routesErr)
    }
    resolve(stats)
  })
})

module.exports = async function build(argv) {
  const copiedSuccess = await ensureDirs()
  if (!copiedSuccess) {
    report.failure('shite')
  }
  try {
    report.info('making routes file with webpack')
    const routesStats = await promiseWebpack(routesWebpack('routing', { mode: 'production' }))
    report.success()

    report.info('build routes from emitted file')
    require(`${process.cwd()}/.app/routes/buildRoutes`)
    report.success()

    report.info('build client app')
    await promiseWebpack(clientWebpack('client', { mode: 'production' }))
    report.success()

    report.info('build static html')
    await promiseWebpack(staticHtmlWebpack('static', { mode: 'production' }))
    report.success()

    report.info('using htaccess')
    const router = await wireHtaccess()
    console.log({ router })
    report.success()
    report.chido('your app is production ready!!!')
  }
  catch (error) {
    report.failure(error)
  }
}
