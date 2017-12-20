import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { historyMock } from '>/mockdata'

import HistoryList from './HistoryList'

storiesOf('History List', module)
  .add('Default', () => defaults({
    render: h => h(HistoryList, {
      props: {
        history: historyMock,
        status: { pending: false, hasValidationErrors: false },
        canLoadMore: true,
        fetchMore: () => {},
      },
    }),
  }))
