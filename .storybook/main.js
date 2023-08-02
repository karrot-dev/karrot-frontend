import { mergeConfig } from 'vite'
import {quasar} from "@quasar/vite-plugin";

const aliases = require('../aliases').resolve.alias

/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  viteFinal (config) {
    return mergeConfig(config, {
      resolve: {
        alias: aliases,
      },
      define: {
        // TODO: think some more...
        "process.env": {}
      },
      plugins: [
        quasar({}),
      ]
    })
  },
};
export default config;
