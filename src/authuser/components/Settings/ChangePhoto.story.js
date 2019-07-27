import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'

import ChangePhoto from './ChangePhoto'
import { statusMocks, storybookDefaults as defaults } from '>/helpers'

import logo from '@/statics/carrot_logo.png'

const on = {
  save: action('save'),
}

storiesOf('ChangePhoto', module)
  .add('with photo', () => defaults({
    render: h => h(ChangePhoto, {
      props: {
        value: {
          photoUrls: {
            fullSize: logo,
          },
        },
        helper: 'Helper',
        label: 'Label',
        status: statusMocks.default(),
      },
      on,
    }),
  }))
  .add('empty', () => defaults({
    render: h => h(ChangePhoto, {
      props: {
        status: statusMocks.default(),
      },
      on,
    }),
  }))
  .add('pending', () => defaults({
    render: h => h(ChangePhoto, {
      props: {
        status: statusMocks.pending(),
      },
      on,
    }),
  }))
  .add('error', () => defaults({
    render: h => h(ChangePhoto, {
      props: {
        status: statusMocks.validationError('photo', 'something is wrong'),
      },
      on,
    }),
  }))
