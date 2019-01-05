const fse = require('fs-extra')

module.exports = async function Start(argv) {
  // First copy chido-dir to .chido in the root of the app
  const processDir = process.cwd()
  const appDir = `${__dirname}/../app-dir/`
  const appDirExists = await fse.pathExists(appDir)
  if (!appDirExists) {
    throw new Error('There\'s a problem with your "chido" installation, please "npm uninstall chido" and then run "npm install chido" again!!!')
  }

  const dotAppDir = `${processDir}/.app`
  const dotAppDirExists = await fse.pathExists(dotAppDir)
  // if (dotappDirExists) {
  //   rimraf.sync(dotappDir)
  // }

  await fse.copy(appDir, dotAppDir)

  const copiedSuccess = await fse.pathExists(dotAppDir)
  require('../src/dev-server')
}
