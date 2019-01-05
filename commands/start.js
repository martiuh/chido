const fse = require('fs-extra')

module.exports = async function Start(argv) {
  console.clear()
  // First copy chido-dir to .chido in the root of the app
  const processDir = process.cwd()
  const chidoDir = `${__dirname}/../chido-app/`
  const chidoDirExists = await fse.pathExists(chidoDir)
  if (!chidoDirExists) {
    throw new Error('There\'s a problem with your "chido" installation, please "npm uninstall chido" and then run "npm install chido" again!!!')
  }

  const dotAppDir = `${processDir}/.app`
  const dotAppDirExists = await fse.pathExists(dotAppDir)
  // if (dotChidoDirExists) {
  //   rimraf.sync(dotChidoDir)
  // }

  await fse.copy(chidoDir, dotAppDir)
  require('../src/dev-server')
}