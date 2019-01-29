#!/usr/bin/env node
/* eslint-disable no-unused-expressions */
const cli = require('yargs')
const start = require('./start')
const build = require('./build')

cli
  .command({
    command: 'start',
    desc: `
      Start a development server with HMR
    `,
    handler: argv => start(argv),
    builder: b => {
      b.option('port', {
        alias: 'p',
        type: 'string',
        default: '3030',
        describe: 'Set development server port. "default: 3030"'
      })
      b.option('routing', {
        alias: 'r',
        type: 'string',
        default: 'htaccess',
        describe: 'Set the routing strategy for your htaccess. "default: htaccess"'
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
