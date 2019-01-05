// This is only used in the client-side
import React from 'react'
import { AppContainer } from 'react-hot-loader'
import socketIo from 'socket.io-client'
import { render } from 'react-dom'
import c from '../socket-constants'

import DevRouter from './DevRouter'

const socket = socketIo()
socket.on(c.READY, () => console.log('[dinastico] socket connection enabled'))
socket.on(c.RELOAD, () => {
  console.log('[dinastico] reloading app')
  window.location.reload()
})


const appRoot = document.getElementById('__dinastico')

const renderApp = App => render(
  <AppContainer>
    <App />
  </AppContainer>,
  appRoot
)

renderApp(DevRouter)

if (module.hot) {
  module.hot.accept('./DevRouter', () => {
    // eslint-disable-next-line global-require
    const NewDevRouter = require('./DevRouter').default
    renderApp(NewDevRouter)
  })
}
