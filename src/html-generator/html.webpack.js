// Only one entry point
const path = require('path')
const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')
const webpack = require('webpack')
const fs = require('fs')
const webpackMerge = require('webpack-merge')

const chidoShared = require('./html.shared')
/* eslint-disable-next-line import/no-unresolved */
const sharedConfig = require('../client-webpack/webpack.shared')

module.exports = function ChidoWebpack(env, argv) {
  const rawRoutes = fs.readFileSync(path.join(process.cwd(), '/.app/routes/routes.json'))
  const routes = JSON.parse(rawRoutes.toString())
  const paths = Object.keys(routes)
  const config = {
    mode: 'production',
    entry: path.join(process.cwd(), '/.app/build-static-html.js'),
    output: {
      filename: '.chido__hidden.js',
      path: path.join(process.cwd(), '/public'),
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
        IS_STATIC: true,
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    ]
  }

  const shared = sharedConfig(env, argv)
  shared.module.rules = shared.module.rules.filter(({ test }) => String(test) !== String(/\.css$/))
  return webpackMerge.smart(shared, config, chidoShared)
}
