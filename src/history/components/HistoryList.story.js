// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT




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
        canFetchPast: true,
        fetchPast: () => {},
      },
    }),
  }))
