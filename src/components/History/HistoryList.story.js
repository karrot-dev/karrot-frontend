import { storiesOf } from '@storybook/vue'
import { historyMock } from '>/mockdata'
import i18n from '@/i18n'
import router from '@/router'

import HistoryList from './HistoryList'

storiesOf('History List', module)
  .add('Default', () => ({
    render: h => h(HistoryList, {
      props: {
        history: historyMock,
        status: { pending: false, hasValidationErrors: false },
        canLoadMore: true,
        fetchMore: () => {},
      },
    }),
    i18n,
    router,
  }))
