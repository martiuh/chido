import React from 'react'
import { Router } from '@reach/router'
import { hydrate } from 'react-dom'
import universal from 'react-universal-component'

/* eslint-disable import/no-unresolved, import/extensions*/
import asyncChunks from './routes/async-chunks'
import chidoRoutes from './routes/chido-routes.json'
import fullRoutes from './routes/routes.json'
import fileRouter from './routes/file-router'
/* eslint-enable import/no-unresolved*/
import { pick } from './reach-utils'

let { pathname } = window.location
const chidoRoot = document.getElementById('__chido')
const routesArr = Object.values(chidoRoutes)
window.__asyncChunks = asyncChunks
window.__fullRoutes = fullRoutes
window.__dynamicRoutes = routesArr.filter(dina => !!dina.route)

const router = routesArr.map(routeObj => ({
  path: routeObj.route || routeObj.directory,
  chunkName: routeObj.chunkName
}))

pathname = pathname === '/' ? pathname : pathname.replace(/(\/)/, '')
let siteChunk = fullRoutes[pathname]
if (!siteChunk) {
  const dynamicMatch = pick(router, pathname)
  if (dynamicMatch) {
    siteChunk = dynamicMatch.route.chunkName
  }
}

const thePage = asyncChunks[siteChunk]
if (thePage && thePage.load) {
  const chunksArr = Object.keys(fileRouter)

  hydrate(
    <Router>
      {chunksArr.map(chunk => {
        let routePath = fileRouter[chunk]
        routePath = routePath === 'index/' ? '/' : routePath
        routePath = chidoRoutes[routePath] ? `${routePath}*` : routePath
        const importFunction = asyncChunks[chunk]
        const AsyncRoute = universal(importFunction)
        console.log(routePath)
        return <AsyncRoute path={routePath} key={chunk} />
      })}
    </Router>,
    chidoRoot
  )
}
