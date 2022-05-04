import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'

import KAbout from './KAbout'
import { createDatastore, storybookDefaults as defaults } from '>/helpers'

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
