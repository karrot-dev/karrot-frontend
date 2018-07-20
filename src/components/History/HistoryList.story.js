import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue'
import { historyMock } from '>/mockdata'

import HistoryListUI from './HistoryListUI'

storiesOf('History List', module)
  .add('Default', () => defaults({
    render: h => h(HistoryListUI, {
      props: {
        history: historyMock,
        status: { pending: false, hasValidationErrors: false },
        canFetchPast: true,
        fetchPast: () => {},
      },
    }),
  }))
