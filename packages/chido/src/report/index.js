const chalk = require('chalk')

const { log } = console
const alerter = (color, type, msg = '') => log(`${chalk[color](type)} ${msg}`)

module.exports = {
  success: (msg = 'done') => alerter('green', 'success', msg),
  error: msg => alerter('red', 'error', msg),
  event: msg => alerter('blue', 'info', msg),
  info: msg => alerter('blue', 'info', msg),
  failure: msg => {
    alerter('red', 'FAILURE', msg)
    process.exit(1)
  },
  warn: msg => alerter('yellow', 'warning', msg),
  chido: msg => alerter('cyan', `[chido] ${msg}`)
}
