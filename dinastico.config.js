/*
  Change things such as webpackConfig
  (be mindful not to override dinastico's webpack configuration)
*/
const path = require('path')

/*
  env could be
  `routing`
  `client`: the client app
  `static`: the static site, here you can't play with javascript
*/
exports.webpackConfig = (env, argv) => ({
  resolve: {
    alias: {
      animeapi: path.resolve(__dirname, './src/animeapi.js')
    }
  }
})
