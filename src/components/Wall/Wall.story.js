import { storiesOf } from '@storybook/vue'

import Wall from './Wall.vue'
import WallCard from './WallCard.vue'

storiesOf('Wall', module)
  .add('Wall', () => ({
    components: { Wall },
    template: '<div id="q-app><Wall/></div>'
  }))
  .add('WallCard', () => ({
    components: { WallCard },
    template: '<div id="q-app" style="padding: 2em"><WallCard/></div>'
  }))
