const chalk = require('chalk')

const { log } = console
const alerter = (color, type, msg = '') => log(`${chalk[color](type)} ${msg}`)

module.exports = {
  success: msg => alerter('green', 'success', msg),
  error: msg => alerter('red', 'error', msg),
  event: msg => alerter('blue', 'event', msg),
  failure: msg => {
    alerter('red', 'FAILURE', msg)
    process.exit(0)
  },
  warn: msg => alerter('yellow', 'warning', msg)
}
