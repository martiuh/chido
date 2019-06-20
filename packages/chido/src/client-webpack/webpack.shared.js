/*
  This webpack configuration is shared between
  client-webpack, html-generator and routes-generator
 */
const FriendlyErrorsWebpack = require('friendly-errors-webpack-plugin')
const path = require('path')
const merge = require('webpack-merge')
const fs = require('fs')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const babelOptions = require('./babel-loader.options')

module.exports = function webpackShared(env, argv) {
  let userConfig = {}
  const processRoot = process.cwd()
  const configPath = path.join(processRoot, 'chido.config.js')
  if (fs.existsSync(configPath)) {
    const { webpackConfig } = require(configPath)
    if (typeof webpackConfig === 'function') {
      userConfig = webpackConfig(env, argv)
    }
  }

  const config = {
    context: process.cwd(),
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: babelOptions()
        }
      ]
      // No .css here please
    },
    resolve: {
      extensions: ['.js', '.css', '.scss', '.sass', '.jsx']
    },
    plugins: [
      new webpack.DefinePlugin({
        STATIC: JSON.stringify(env === 'static')
      }),
      new FriendlyErrorsPlugin()
    ]
  }
  return merge.smart(config, userConfig)
}
