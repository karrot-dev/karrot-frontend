import { storiesOf } from '@storybook/vue3'
import { h } from 'vue'

import { createDatastore, storybookDefaults as defaults } from '>/helpers'

import KAbout from './KAbout'

storiesOf('KAbout', module)
  .add('KAbout', () => defaults({
    render: () => h(KAbout),
    store: createDatastore({
      about: {
        getters: {
          deployed: () => ({
            env: 'production',
            date: '2100-02-03',
          }),
        },
      },
    }),
  }))
