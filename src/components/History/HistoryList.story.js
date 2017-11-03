import { storiesOf } from '@storybook/vue'
import { historyMock } from '>/mockdata'
import i18n from '@/i18n'
import router from '@/router'

import HistoryListUI from './HistoryListUI'

storiesOf('History List', module)
  .add('Default', () => ({
    render: h => h(HistoryListUI, {
      props: {
        history: historyMock,
        status: { isWaiting: false, error: null },
        canLoadMore: true,
        fetchMore: () => {},
      },
    }),
    i18n,
    router,
  }))
