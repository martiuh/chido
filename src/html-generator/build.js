import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerLocation, Router } from '@reach/router'
import Helmet from 'react-helmet'
import nunjucks from 'nunjucks'
import path from 'path'

import { jsMatch, cssMatch } from '../utils'
/* eslint-disable-next-line import/no-unresolved, import/extensions */
import * as syncChunks from '../routes/sync-chunks'
/* eslint-disable import/no-unresolved */
import chidoRoutes from '../routes/chido-routes.json'
import fullRoutes from '../routes/routes.json'
import stats from '../../public/stats.json'
/* eslint-enable import/no-unresolved */

const chidoStats = stats.assetsByChunkName

// import chidoRoutes from './chidoRoutes'
// 1. Get Pages
// 2. Make routes according to filename

export default function (locals) {
  const { routes, template } = locals
  const chunkName = fullRoutes[locals.path] // The name of the component
  const chunkFiles = chidoStats[chunkName]

  const organizeChunks = arr => {
    const js = []
    const css = []

    if (!Array.isArray(arr)) {
      // Find out what file type is
      if (typeof arr === 'string') {
        if (jsMatch(arr)) {
          js.push(arr)
        }
        else if (cssMatch(arr)) {
          css.push(arr)
        }
      }
    }
    else {
      arr.forEach(A => {
        if (jsMatch(A)) {
          js.push(A)
        }
        else if (cssMatch(A)) {
          css.push(A)
        }
      })
    }
    return { js, css }
  }

  let js = []
  let css = []
  Object.keys(chidoStats).forEach(chunk => {
    let validChunk = null
    chunk.split('~').forEach(c => {
      if (validChunk) {
        return
      }
      validChunk = c === chunkName ? chunk : null
      return null
    })
    if (validChunk) {
      const validChunksArr = chidoStats[validChunk]
      const fullChunks = organizeChunks(validChunksArr)
      js = [...js, ...fullChunks.js]
      css = [...css, ...fullChunks.css]
    }
  })
  const addPath = value => `/${value}`
  const bundleChunks = organizeChunks(chidoStats.bundle) // webpack bundle
  const bootstrapChunk = organizeChunks(chidoStats.bootstrap) // app bootstrap
  let jsArr = [...js, ...bootstrapChunk.js, ...bundleChunks.js]
  jsArr = jsArr.filter(value => !!value)
  jsArr = jsArr.map(addPath)

  let cssArr = [...css, ...bootstrapChunk.js, ...bundleChunks.css]
  cssArr = cssArr.filter(value => !!value)
  cssArr = cssArr.map(addPath)

  let pages = {}
  Object.keys(routes).forEach(P => {
    pages = {
      ...pages,
      [P]: jsArr[0]
    }
    return null
  })

  const url = locals.path
  const Component = syncChunks[chunkName].default
  let Url = url === '/index' ? '/' : url
  Url = chidoRoutes[url] ? chidoRoutes[url].routeName : Url
  const App = () => (
    <ServerLocation url={url}>
      <Router baseuri='/'>
        <Component path={Url} />
      </Router>
    </ServerLocation>
  )

  const appString = renderToString(<App />)
  const {
    title,
    bodyAttributes,
    htmlAttributes,
    link,
    meta,
    noscript,
    script,
    style
  } = Helmet.renderStatic()

  const jsString = jsArr.map(J => `<script src="${J}" type="text/javascript" async></script>`).join('\n')
  const cssString = cssArr.map(C => `<link href="${C}" rel="stylesheet" />`).join('\n')
  const props = {
    js: jsString,
    css: cssString,
    app: appString,
    title: title.toString(),
    htmlAttributes: htmlAttributes.toString(),
    link: link.toString(),
    meta: meta.toString(),
    noscript: noscript.toString(),
    script: script.toString(),
    style: style.toString(),
    bodyAttributes: bodyAttributes.toString()

  }

  const nunjucksInstance = nunjucks.configure({
    autoescape: false
  })
  return nunjucksInstance.renderString(template.toString(), props)
}
