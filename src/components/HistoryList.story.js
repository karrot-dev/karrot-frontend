import { storiesOf } from '@storybook/vue'
import { historyMock } from '>/mockdata'
import i18n from '@/i18n'
import router from '@/router'

import HistoryList from './HistoryList.vue'

storiesOf('History List', module)
  .add('Default', () => ({
    components: { HistoryList },
    template: '<HistoryList :history="history" :status="status" :canLoadMore="canLoadMore"></HistoryList>',
    data () {
      return {
        history: historyMock,
        status: { isWaiting: false, error: null },
        canLoadMore: true,
      }
    },
    i18n,
    router,
  }))
