import { quasar } from '@quasar/vite-plugin'
import { mergeConfig } from 'vite'

const aliases = require('../aliases').resolve.alias

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  docs: {
    autodocs: false,
  },
  viteFinal (config) {
    return mergeConfig(config, {
      resolve: {
        alias: aliases,
      },
      define: {
        // TODO: think some more...
        // this is a bit of a hack as should use import.meta.env now
        // but some libraries break as they still use process.env
        // I guess quasar handles this for us
        'process.env': {},
      },
      plugins: [
        // we're using the vue plugin as storybook injects it
        // when we configure it in vitest.config.js we add in
        // transformAssetUrls from quasar, so maybe this will
        // break something, and we need to swap out the vue plugin
        // for our own... let's see!
        quasar({
          sassVariables: '@/css/quasar.variables.sass',
        }),
      ],
    })
  },
}
export default config
