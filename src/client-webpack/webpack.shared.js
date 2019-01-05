/*
  This webpack configuration is shared between client-webpack, html-generator and routes-generator
 */
const path = require('path')
const merge = require('webpack-merge')
const fs = require('fs')
const webpack = require('webpack')

const babelOptions = require('../babelOptions')

module.exports = function webpackShared(env, argv) {
  let userConfig = {}
  const processRoot = process.cwd()
  const configPath = path.join(processRoot, 'dinastico.config.js')
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
          options: babelOptions
        }
      ]
      // No .css here please
    },
    resolve: {
      extensions: ['.js', '.css', '.scss', '.sass', '.jsx'],
      alias: {
        'react-dom': '@hot-loader/react-dom',
        'dinastico-link': path.resolve(__dirname, '../dinastico-link')
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        STATIC: JSON.stringify(env === 'static')
      })
    ]
  }
  return merge.smart(config, userConfig)
}
