module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      targets: {
        browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
      }
    }]
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import'
  ],
  env: {
    test: {
      plugins: [
        'babel-plugin-dynamic-import-node'
      ]
    }
  }
}
