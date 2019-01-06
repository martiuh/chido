#!/usr/bin/env node
/* eslint-disable no-unused-expressions */

const cli = require('yargs')
const start = require('./start')
const build = require('./build')

console.clear()

cli
  .command({
    command: 'start',
    desc: `
      Start a development server with HMR
    `,
    handler: argv => start(argv),
    builder: b => {
      b.option('p', {
        alias: 'port',
        type: 'string',
        default: '3030',
        describe: 'Set development server port. "default: 3030"'
      })
    }
  })
  .command({
    command: 'build',
    desc: `
      Build a production ready hybrid app
    `,
    handler: argv => build(argv)
  })
  .help()
  .argv
