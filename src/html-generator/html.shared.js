/*
  This webpack configuration is shared between
  html-generator and routes-generator
  it should be handled as a server side rendering
  configuration
 */
module.exports = {
  module: {
    rules: [
      {
        test: /\.(css|scss|sass)$/,
        exclude: /node_modules/,
        use: [
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
