import { storiesOf } from '@storybook/vue'

import HistoryList from './HistoryList.vue'

storiesOf('History List', module)
  .add('Default', () => ({
    components: { HistoryList },
    template: '<div id="q-app" style="padding: 2em"><HistoryList :history="history"></HistoryList></div>',
    data () {
      return {
        history: [
          {users: [1, 2, 3], what: 'picked up at ...', when: '2017-08-12T08:00:00Z', event: 'picked up at a store'},
          {users: [1, 3], what: 'picked up at ...', when: '2017-08-12T08:00:00Z', event: 'picked up at a store'},
          {users: [], what: 'picked up at ...', when: '2017-08-12T08:00:00Z', event: 'joined the group'},
        ],
      }
    },
  }))
