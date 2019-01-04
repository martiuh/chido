const path = require('path')
const WriteFilePlugin = require('write-file-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const rimraf = require('rimraf')
const nunjucks = require('nunjucks')
const fs = require('fs')

const devTemplatePath = path.join(__dirname, 'dev-template.html')

rimraf.sync(devTemplatePath)
const template = nunjucks.render(path.resolve(__dirname, '../default-html/index.html'))
fs.writeFileSync(devTemplatePath, template)
module.exports = {
  entry: {
    bundle: [
      'webpack-hot-middleware/client?__webpack_hmr&reload=true&overlay=true',
      path.join(__dirname, '../dev-renderer/dev-renderer')
    ]
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../../public/'),
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './dev-template.html')
    }),
    new WriteFilePlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
