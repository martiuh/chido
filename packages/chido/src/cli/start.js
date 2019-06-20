const fse = require('fs-extra')
const ensureDirs = require('./ensureDirs')

module.exports = async function start(argv) {
  await ensureDirs()
  require('../dev-server')
}
