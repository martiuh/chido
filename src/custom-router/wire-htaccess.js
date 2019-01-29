/* eslint-disable-next-line import/no-unresolved */
const fs = require('fs')
/*
  Fulfill these use cases:
  1. /hello/:language/:person (two dynamic params next to each other)
    How to route `/hello/spa` and `/hello/spa/tonatiuh` to its correspondant directory
*/
module.exports = function wireHtaccess() {
  const currentDir = process.cwd()
  let rawDynamic = fs.readFileSync(`${currentDir}/.app/routes/chido-routes.json`)
  rawDynamic = JSON.parse(rawDynamic.toString())
  const dynamicArr = Object.values(rawDynamic).filter(({ route }) => !!route)
  const regexString = /[^/]{2,256}$/
  const lastRegexString = /[^/]{2,256}\/?$/
  const doubleDotRegex = /:[-a-zA-Z0-9@:%_+.~#?&=]*/
  let validRoutes = []
  dynamicArr.forEach(({ route, directory }) => {
    let segments = route.split('/')
    segments = segments.map((segment, index) => {
      if (index === segments.length - 1) {
        return segment.replace(doubleDotRegex, lastRegexString.toString())
      }
      return segment.replace(doubleDotRegex, regexString.toString())
    })
    segments = segments.join('/')
    validRoutes = [...validRoutes,
      `RewriteCond %{REQUEST_URI} !=^${segments}
      RewriteRule ${segments} /public/${directory} [L]`
    ]
  })
  return validRoutes
}
