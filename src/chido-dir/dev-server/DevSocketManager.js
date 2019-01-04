const c = require('./socket-constants')

class DevSocketClass {
  constructor() {
    this.running = false

    this.init = this.init.bind(this)
    this.getSocket = this.getSocket.bind(this)
  }

  init(server) {
    this.theSocket = null
    // eslint-disable-next-line global-require
    this.websocket = require('socket.io')(server)
    this.websocket.on('connection', s => {
      this.theSocket = s
      s.emit(c.READY)
    })
    this.running = true
  }

  getSocket() {
    return this.running && this.websocket
  }
}

module.exports = new DevSocketClass()
