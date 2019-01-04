// Only one entry point
const path = require('path')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')
const webpackMerge = require('webpack-merge')
const sharedConfig = require('../client-webpack/webpack.shared')
const dinasticoShared = require('../html-generator/html.shared')

module.exports = function dinasticoWebpack(env, argv) {
  const config = {
    target: 'node',
    node: {
      __dirname: false
    },
    mode: 'production',
    entry: path.resolve(__dirname, 'build-hybrid-routes.js'),
    output: {
      filename: 'buildRoutes.js',
      path: path.join(__dirname, '../routes')
    },
    plugins: [
      new WriteFilePlugin(),
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
