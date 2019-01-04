module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      generators: true,
      experimentalObjectRestSpread: true
    },
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  plugins: ['flowtype'],
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    },
    'import/resolver': {
      alias: [
        ['dinastico-link', './.dinas/dinastico-link/index.js'],
        ['animeapi', './src/animeapi']
      ],
      node: {
        extensions: ['.js', '.json']
      }
    }
  },
  globals: {
    window: true,
    document: true,
    __dirname: true,
    __DEV__: true,
    CONFIG: true,
    process: true,
    jest: true,
    describe: true,
    test: true,
    it: true,
    expect: true,
    beforeEach: true,
    fetch: true,
    alert: true,
    navigator: true,
    URL: true,
    FileReader: true,
    Image: true,
    SW_TESTING: true,
    IS_SERVER: true
  },
  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        styl: 'never',
        css: 'never'
      }
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        exceptions: { noHref: true, invalidHref: true },
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['preferButton']
      }
    ],
    'jsx-a11y/label-has-for': [
      2,
      {
        required: {
          some: ['nesting', 'id']
        },
        allowChildren: false
      }
    ],
    'no-shadow': 0,
    'no-use-before-define': 0,
    'no-param-reassign': 0,
    'react/prop-types': 0,
    'react/no-render-return-value': 0,
    'no-confusing-arrow': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    camelcase: 0,
    'prefer-template': 1,
    'react/no-array-index-key': 1,
    'global-require': 1,
    'react/jsx-indent': 1,
    'dot-notation': 1,
    'import/no-named-default': 1,
    'no-unused-vars': 1,
    'flowtype/no-weak-types': 1,
    'consistent-return': 1,
    'import/prefer-default-export': 1,
    'no-console': 1,
    'jsx-a11y/no-static-element-interactions': 1,
    'no-case-declarations': 1,
    semi: [2, 'never'],
    'flowtype/semi': [2, 'never'],
    'jsx-quotes': [2, 'prefer-single'],
    'react/jsx-filename-extension': [2, { extensions: ['.jsx', '.js'] }],
    'spaced-comment': [2, 'always', { markers: ['?'] }],
    'arrow-parens': [2, 'as-needed', { requireForBlockBody: false }],
    'brace-style': [2, 'stroustrup'],
    'import/no-unresolved': [2, { commonjs: true, caseSensitive: true }],
    'no-unused-expressions': [
      2,
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true
      }
    ],
    'comma-dangle': [
      2,
      {
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    'max-len': [
      'error',
      {
        code: 100,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }
    ],
    'react/jsx-one-expression-per-line': 0,
    'react/sort-comp': [
      2,
      {
        order: [
          'propTypes',
          'props',
          'state',
          'defaultProps',
          'contextTypes',
          'childContextTypes',
          'getChildContext',
          'static-methods',
          'lifecycle',
          'everything-else',
          'render'
        ]
      }
    ],
    'linebreak-style': 0
  }
}