process.env.NODE_ENV = process.env.NODE_ENV || 'development'
const rimraf = require('rimraf')
const fs = require('fs-extra')
const path = require('path')
const { spawn } = require('child_process')

module.exports = async function Start(argv) {
  console.clear()
  // First copy chido-dir to .chido in the root of the app
  const processDir = process.cwd()
  const chidoDir = `${__dirname}/../chido-dir/`
  const chidoDirExists = await fs.pathExists(chidoDir)
  if (!chidoDirExists) {
    throw new Error('There\'s a problem with your "chido" installation, please "npm uninstall chido" and then run "npm install chido" again!!!')
  }

  const dotChidoDir = `${processDir}/.chido-app`
  await fs.copy(chidoDir, dotChidoDir)
  require(`${dotChidoDir}/dev-server/index.js`)
}
