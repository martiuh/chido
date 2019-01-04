// Only one entry point
const path = require('path')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const webpackMerge = require('webpack-merge')

const dinasticoShared = require('./html.shared')
const routes = require('../routes/routes.json')
const sharedConfig = require('../client-webpack/webpack.shared')

const paths = Object.keys(routes)

module.exports = function dinasticoWebpack(env, argv) {
  const config = {
    mode: 'production',
    entry: path.resolve(__dirname, 'build.js'),
    output: {
      filename: '.dinastico__hidden.js',
      path: path.join(__dirname, '../../public'),
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    plugins: [
      new StaticSiteGeneratorPlugin({
        paths,
        locals: {
          routes,
          template: fs.readFileSync(path.join(__dirname, '../default-html/index.html'))
        }
      }),
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new webpack.DefinePlugin({
        IS_SERVER: true,
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    ]
  }

  const shared = sharedConfig(env, argv)
  shared.module.rules = shared.module.rules.filter(({ test }) => String(test) !== String(/\.css$/))
  return webpackMerge.smart(shared, config, dinasticoShared)
}
