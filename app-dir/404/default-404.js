import React from 'react'

const mainStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw'
}

export default () => (
  <main style={mainStyle}>
    <h1>404 - Not Found</h1>
    <p>To change this page, just build a <code>src/pages/404.js</code> file</p>
  </main>
)