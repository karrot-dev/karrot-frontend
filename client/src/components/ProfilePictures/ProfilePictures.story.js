import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'

import ProfilePicture from './ProfilePicture'
import { usersMock } from '>/mockdata'

storiesOf('ProfilePicture', module)
  .add('Profile Pictures', () => defaults({
    render: h => h(ProfilePicture, {
      props: {
        user: usersMock[0],
        size: 100,
      },
    }),
  }))
