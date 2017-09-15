import { storiesOf } from '@storybook/vue'

import Wall from './Wall.vue'
import WallCard from './WallCard.vue'
import ProfilePicture from '../ProfilePictures/ProfilePicture.vue'
import { messagesMock } from '../mockdata.js'

const wallCard = `
<div id="q-app" style="padding: 2em">
  <WallCard>
    <template slot=icon><ProfilePicture :user="user" :size="30"/></template>
    <template slot=header>picked up at SomeStore</template>
    <template slot=time>11:15</template>
    <div>15kg saved</div>
  </WallCard>
</div>
`

storiesOf('Wall', module)
  .add('Wall', () => ({
    components: { Wall },
    template: '<div id="q-app" style="padding: 2em"><Wall :messages="messages"/></div>',
    data () {
      return {
        messages: messagesMock
      }
    }
  }))
  .add('WallCard', () => ({
    components: { WallCard, ProfilePicture },
    template: wallCard,
    data () {
      return {
        user: {
          id: 5,
          display_name: 'Lars Wolf'
        }
      }
    }
  }))
