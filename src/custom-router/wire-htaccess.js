/* eslint-disable-next-line import/no-unresolved */
const chidoRouter = require('./.routes/chido-routes.json')

/*
  Fulfill these use cases:
  1. /hello/:language/:person (two dynamic params next to each other)
    How to route `/hello/spa` and `/hello/spa/tonatiuh` to its correspondant directory
  2. /product/:productId/photos
    The desired route for `/product/iphone-4/` and `/product/iphone-4/photos
*/
const dynamicArr = Object.values(chidoRouter).filter(({ route }) => !!route)

const regexString = '\\w+'
const lastRegexString = '\\w+/?$'

dynamicArr.forEach(({ route, directory }) => {
  let segments = route.split('/')
  segments = segments.map((segment, index) => {
    if (index === segments.length - 1) {
      return segment.replace(/:\w+/, lastRegexString.toString())
    }
    return segment.replace(/:\w+/, regexString.toString())
  })
  segments = segments.join('/')
  console.log(`
  RewriteCond %{REQUEST_URI} !=^${segments}
  RewriteRule ${segments} /public/${directory} [L]
  `)
// RewriteCond %{REQUEST_URI} !=^/movies/\d*/?$
// RewriteRule  ^movies/\d*/?$ /public/movies/movieId/ [L]
})
