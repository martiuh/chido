module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', {
      modules: 'umd'
    }]
  ],
  plugins: [
    'universal-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-classes'
  ],
  env: {
    development: {
      plugins: ['react-hot-loader/babel']
    }
  }
}
