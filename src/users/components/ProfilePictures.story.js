import { h } from 'vue'
import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue3'

import ProfilePicture from './ProfilePicture'
import { usersMock } from '>/mockdata'

storiesOf('ProfilePicture', module)
  .add('with user', () => defaults({
    render: () => h(ProfilePicture, {
      user: usersMock[0],
      isLink: false,
      size: 100,
    }),
  }))
  .add('without user', () => defaults({
    render: () => h(ProfilePicture, {
      user: {
        id: 1,
        displayName: '?',
      },
      size: 100,
    }, h('div', { class: 'foo' }, 'hello')),
  }))
