const fse = require('fs-extra')
const rimraf = require('rimraf')
const slash = require('slash')

const buildChunks = require('../routes-generator/build-chunks')
const report = require('../report')

module.exports = async function ensureDirs() {
  const processDir = process.cwd()
  const appDir = slash(`${__dirname}/../../app-dir/`)
  report.info('searching for app-dir')
  const appDirExists = await fse.pathExists(appDir)

  if (!appDirExists) {
    throw new Error('There\'s a problem with your "chido" installation, please "npm uninstall chido" and then run "npm install chido" again!!!')
  }

  report.success('app-dir exists')
  report.info('copying app-dir to .app')
  const dotAppDir = slash(`${processDir}/.app`)
  const dotAppDirExists = await fse.pathExists(dotAppDir)
  if (dotAppDirExists) {
    rimraf.sync(dotAppDir)
  }

  await fse.copy(appDir, dotAppDir)
  const copiedSuccess = await fse.pathExists(dotAppDir)
  if (copiedSuccess) {
    report.success('.app dir copied')
  }
  report.info('building chunks')
  buildChunks()
  report.success('chunks built!!!')

  report.info('searching for public directory')
  const publicDir = slash(`${processDir}/public`)
  const publicDirExists = await fse.pathExists(publicDir)
  if (publicDirExists) {
    report.info('removing public directory')
    rimraf.sync(publicDir)
  }
  await fse.ensureDir(publicDir)
  report.success('brand new public directory')
  return true
}
