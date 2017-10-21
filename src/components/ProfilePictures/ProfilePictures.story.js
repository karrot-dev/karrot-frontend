import { storiesOf } from '@storybook/vue'

import ProfilePicture from './ProfilePicture.vue'
import { usersMock } from '>/mockdata'
import i18n from '@/i18n'
import router from '@/router'

storiesOf('ProfilePicture', module)
  .add('Profile Pictures', () => ({
    render: h => h(ProfilePicture, {
      props: {
        user: usersMock[0],
        size: 100,
      },
    }),
    i18n,
    router,
  }))
