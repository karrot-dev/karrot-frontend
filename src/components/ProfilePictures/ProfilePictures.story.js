import { storiesOf } from '@storybook/vue'

import ProfilesInline from './ProfilesInline.vue'
import ProfilePicture from './ProfilePicture.vue'

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
    data () {
      return {
        users: [
          {
            id: 5,
            display_name: 'Max Mustermann'
          },
          {
            id: 6,
            display_name: 'Mira Bellenbaum'
          }
        ]
      }
    }
  }))
  .add('Profiles Inline', () => ({
    components: { ProfilesInline },
    template: '<div><ProfilesInline :users="users"/></div>',
    data () {
      return {
        users: [
          {
            id: 5,
            display_name: 'Max Mustermann'
          },
          {
            id: 6,
            display_name: 'Mira Bellenbaum'
          },
          {
            id: 7,
            display_name: 'Mona Mohnblume'
          },
          {
            id: 8,
            display_name: 'Carla Carlson'
          }
        ]
      }
    }
  }))
  .add('Profile Pictures', () => ({
    components: { ProfilePicture },
    template: '<div><ProfilePicture :user="user"/></div>',
    data () {
      return {
        user: {
          id: 5,
          display_name: 'Lars Wolf'
        }
      }
    }
  }))
