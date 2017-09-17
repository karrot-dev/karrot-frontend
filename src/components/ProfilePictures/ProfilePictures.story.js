import { storiesOf } from '@storybook/vue'

import ProfilesInline from './ProfilesInline.vue'
import ProfilePicture from './ProfilePicture.vue'
import { usersMock } from '../mockdata.js'

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
    template: template,
  }))
  .add('Profiles Inline', () => ({
    components: { ProfilesInline },
    template: '<div><ProfilesInline :users="users"/></div>',
    data () {
      return {
        users: usersMock,
      }
    },
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
