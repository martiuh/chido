/*
  This webpack configuration is shared between html-generator and routes-generator
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
