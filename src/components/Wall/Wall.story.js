import { storiesOf } from '@storybook/vue'

import Wall from './Wall.vue'
import WallCard from './WallCard.vue'
import WallMessage from './WallMessage.vue'
import ProfilePicture from '../ProfilePictures/ProfilePicture.vue'
import { messagesMock, pickupsMock } from '../mockdata.js'

storiesOf('Wall', module)
  .add('Wall', () => ({
    components: { Wall },
    template: '<div id="q-app" style="padding: 2em"><Wall :messages="messages" :emptyPickups="emptyPickups"/></div>',
    data () {
      return {
        messages: messagesMock,
        emptyPickups: pickupsMock
      }
    }
  }))
  .add('WallCard', () => ({
    components: { WallCard, ProfilePicture },
    template: '<div id="q-app" style="padding: 2em"><WallCard/></div>',
    data () {
      return {
        user: {
          id: 5,
          display_name: 'Lars Wolf'
        }
      }
    }
  }))

  .add('WallMessage', () => ({
    components: { WallMessage },
    template: '<div id="q-app" style="padding: 2em"><WallMessage :message="message"/></div>',
    data () {
      return {
        message: messagesMock[0]
      }
    }
  }))
