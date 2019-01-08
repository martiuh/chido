const fse = require('fs-extra')
const ensureDirs = require('./ensureDirs')

module.exports = async function Start(argv) {
  await ensureDirs()
  require('../dev-server')
}
