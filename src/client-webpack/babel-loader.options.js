module.exports = () => {
  // merge client values with this
  const babelLoaderOptions = {
    presets: ['@babel/preset-react', ['@babel/preset-env', { modules: 'umd' }]],
    plugins: [
      '@babel/plugin-transform-regenerator',
      'universal-import',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-transform-classes'
    ],
    env: { development: { plugins: ['react-hot-loader/babel'] } }
  }
  return babelLoaderOptions
}
