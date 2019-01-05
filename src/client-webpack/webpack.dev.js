const path = require('path')
const WriteFilePlugin = require('write-file-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const rimraf = require('rimraf')
const nunjucks = require('nunjucks')
const fs = require('fs')

const devTemplatePath = path.join(__dirname, 'dev-template.html')
const templatePath = path.join(__dirname, '../default-html/index.html')
rimraf.sync(devTemplatePath)
const templateString = fs.readFileSync(templatePath).toString()
const template = nunjucks.renderString(templateString)
fs.writeFileSync(devTemplatePath, template)
module.exports = {
  entry: {
    bundle: [
      'webpack-hot-middleware/client?__webpack_hmr&reload=true&overlay=true',
      path.join(process.cwd(), '/.app/dev-renderer.js')
    ]
  },
  mode: 'development',
  output: {
    path: path.join(process.cwd(), '/public/'),
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(devTemplatePath)
    }),
    new WriteFilePlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
