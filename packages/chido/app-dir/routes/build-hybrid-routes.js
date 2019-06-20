import fs from 'fs'
import path from 'path'

/* eslint-disable import/no-unresolved, import/extensions */
import * as syncChunks from './sync-chunks'
import * as fileRouter from './file-router'
/* eslint-enable import/no-unresolved, import/extensions */

const Pages = Object.values(syncChunks)
const PagesNames = Object.keys(syncChunks)

function buildHybridRoutes() {
  let fullRouter = {}
  let chidoRouter = {}

  Pages.forEach((P, index) => {
    if (!P.default) {
      return null
    }
    const Page = P.default
    let Component = null
    if (!Page.prototype) {
      return null
    }
    if (Page.prototype.isReactComponent) {
      Component = new Page()
      Component = Component.render()
    }
    else {
      Component = Page()
    }
    if (!Component) {
      return null
    }

    const chunkName = PagesNames[index]
    const routeName = fileRouter[chunkName]

    const routeMaker = (obj, currentRoute, routeObj = {}, dina = false) => {
      // If the component have props
      /*
        1. If it has props.path then it's a Router object meaning it's the main currentRoute.
        2. If it has props.children then it could have another Router underneath, making the component a 'parent'
      */
      if (obj.children) {
        if (Array.isArray(obj.children)) {
          obj.children.forEach(child => {
            routeObj = routeMaker(child, currentRoute, routeObj, dina)
          })
        }
        else {
          routeObj = routeMaker(obj.children, currentRoute, routeObj, dina)
        }
      }

      const buildPath = path => {
        // TODO: If path starts with slash then we are dealing with an absolute path
        const finalSlash = string => /.*\/$/.test(string)
        const startsWithDots = string => /^:/.test(string)

        const dotsPath = path
        const hasDots = startsWithDots(path)
        currentRoute = finalSlash(currentRoute)
          ? currentRoute
          : `${currentRoute}/`
        path = finalSlash(path) ? path : path.substr(0, path.length)
        path = hasDots ? `${path.substr(1)}` : path
        path = path === '/' ? '' : `${path}/`
        if (dina === 'router') {
          routeObj[`${routeName}*`] = true
        }
        else if (dina) {
          routeObj[`${currentRoute}${path}`] = {
            routeName: `${routeName}*`,
            dynamic: hasDots,
            route: hasDots ? `${currentRoute}${dotsPath}` : null,
            chunkName,
            directory: `${currentRoute}${path}`
          }
        }
        else {
          routeObj[`${currentRoute}${path}`] = chunkName
        }
      }

      if (obj.props) {
        if (Array.isArray(obj.props)) {
          obj.props.forEach(prop => {
            routeObj = routeMaker(prop, currentRoute, routeObj, dina)
          })
        }
        else if (obj.props.path && !obj.props.children) {
          buildPath(obj.props.path)
        }
        else if (obj.props.path && obj.props.children) {
          buildPath(obj.props.path)
          routeObj = routeMaker(
            obj.props,
            `${currentRoute}${obj.props.path}`,
            routeObj,
            dina
          )
        }
        else {
          routeObj = routeMaker(obj.props, currentRoute, routeObj, dina)
        }
      }

      return routeObj
    }

    const noIndexRoute = routeName === 'index/' ? '/' : routeName
    if (Component.props.children) {
      const componentRoutes = routeMaker(Component, routeName, {})
      const dinaRouter = routeMaker(Component, routeName, {}, true)

      if (!componentRoutes[routeName]) {
        fullRouter = Object.assign({}, fullRouter, {
          [noIndexRoute]: chunkName
        })
      }
      else {
        chidoRouter = Object.assign({}, dinaRouter, chidoRouter)
        fullRouter = Object.assign({}, fullRouter, componentRoutes)
      }
    }
  })

  // remember this file is in the .app/routes directory
  fs.writeFileSync(
    path.join(__dirname, '/routes.json'),
    JSON.stringify(fullRouter, null, '\t')
  )
  fs.writeFileSync(
    path.join(__dirname, '/chido-routes.json'),
    JSON.stringify(chidoRouter, null, '\t')
  )
}

module.exports = buildHybridRoutes
