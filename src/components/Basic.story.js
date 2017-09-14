import { storiesOf } from '@storybook/vue'

import Basic from './Basic.vue'

storiesOf('Basic', module)
  .add('Alex', () => ({
    components: { Basic },
    template: '<div id="q-app"><Basic :name="name"/></div>',
    data () {
      return {
        name: 'Alex'
      }
    }
  }))
  .add('Peter', () => ({
    components: { Basic },
    template: '<div id="q-app"><Basic :name="name"/></div>',
    data () {
      return {
        name: 'Peter'
      }
    }
  }))
