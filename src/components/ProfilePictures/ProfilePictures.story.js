import { storiesOf } from '@storybook/vue'

import ProfilesInline from './ProfilesInlineUI.vue'
import ProfilePicture from './ProfilePicture.vue'
import { usersMock, usersMockWithoutCurrent, currentUserMock } from '>/mockdata'
import i18n from '@/i18n'

const template = `
<div>
  <div style="padding: 1em">
    Not quite ready yet.
    <h5>ToDos</h5>
    <ul>
      <li>Link to user page</li>
      <li>Translate</li>
    </ul>
    <h5>Vars for ProfilePictures</h5>
    <ul>
      <li>Size: in px</li>
    </ul>
  </div>
</div>`

storiesOf('Profile Pictures', module)
  .add('Overview', () => ({
    components: { ProfilesInline },
    template,
  }))
  .add('Profiles Inline (with join)', () => ({
    components: { ProfilesInline },
    template: '<div><ProfilesInline :currentUser="currentUser" slots="10" :users="users"/></div>',
    data () {
      return {
        users: usersMockWithoutCurrent,
        currentUser: currentUserMock,
      }
    },
    i18n,
  }))
  .add('Profiles Inline (with leave)', () => ({
    components: { ProfilesInline },
    template: '<div><ProfilesInline :currentUser="currentUser" slots="10" :users="users"/></div>',
    data () {
      return {
        users: usersMock,
        currentUser: currentUserMock,
      }
    },
    i18n,
  }))
  .add('Profile Pictures', () => ({
    components: { ProfilePicture },
    template: '<div><ProfilePicture :user="user"/></div>',
    data () {
      return {
        user: {
          id: 5,
          displayName: 'Lars Wolf',
        },
      }
    },
  }))
