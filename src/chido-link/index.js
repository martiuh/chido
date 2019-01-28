import React from 'react'
import universal from 'react-universal-component'
import { Link, navigate } from '@reach/router'

import { pick } from '../../app-dir/reach-utils'
import { isDev } from '../../app-dir/utils'

const getChunkName = to => {
  let simpleTo = to[0] === '/' && to !== '/' ? to.substr(1) : to
  simpleTo = to === '/' ? to : `${simpleTo}/`
  let chunkName = window.__fullRoutes[simpleTo]
  chunkName = chunkName || window.__fullRoutes[to]
  return chunkName
}

const tryPrefetch = to => {
  if (isDev) {
    return null
  }
  const chunkName = getChunkName(to)
  let importFn = window.__asyncChunks[chunkName]
  if (!importFn) {
    const routesArr = window.__dynamicRoutes.map(obj => ({
      path: obj.route,
      chunkName: obj.chunkName
    }))
    const dynamicRoute = pick(routesArr, to)
    if (dynamicRoute) {
      importFn = window.__asyncChunks[dynamicRoute.route.chunkName]
    }
  }
  return importFn
}

export default function ChidoLink(fullprops) {
  const { to, onClick, onMouseEnter, onFocus, ...props } = fullprops
  return (
    <Link
      to={to}
      onFocus={e => {
        onFocus && onFocus(e)
        const importFn = tryPrefetch(to)
        if (importFn) {
          universal(importFn).preload()
        }
      }}
      onMouseEnter={e => {
        onMouseEnter && onMouseEnter(e)
        const importFn = tryPrefetch(to)
        if (importFn) {
          universal(importFn).preload()
        }
      }}
      onClick={event => {
        onClick && onClick(event)
        if (
          event.button === 0 && // ignore right clicks
          !props.target && // let browser handle "target=_blank"
          !event.defaultPrevented && // onClick prevented default
          !event.metaKey && // ignore clicks with modifier keys...
          !event.altKey &&
          !event.ctrlKey &&
          !event.shiftKey
        ) {
          event.preventDefault()
          const importFn = tryPrefetch(to)
          if (importFn) {
            // What happen if the promise gets rejected?
            universal(importFn)
              .preload()
              .then(() => navigate(to))
          } else {
            navigate(to)
          }
        }
      }}
      {...props}
    />
  )
}
