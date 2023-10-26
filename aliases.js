/*
this is so we can define the webpack aliases for multiple purposes, these are:
- the webpack config :)
- local editor config
- eslint resolver

It's a valid (but minimal) webpack config.
*/
const { resolve } = require('path')
module.exports = {
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '>': resolve(__dirname, './test'),
      variables: resolve(__dirname, './src/css/quasar.variables.sass'),
      editbox: resolve(__dirname, './src/css/karrot.editbox.sass'),

      // vue: 'vue/dist/vue.runtime.esm-browser.prod',
    },
  },
}
