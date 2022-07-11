<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT




=======
import { h } from 'vue'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { storybookDefaults as defaults } from '>/helpers'
import { storiesOf } from '@storybook/vue3'
import { historyMock } from '>/mockdata'

import HistoryList from './HistoryList'

storiesOf('History List', module)
  .add('Default', () => defaults({
    render: () => h(HistoryList, {
      history: historyMock,
      status: { pending: false, hasValidationErrors: false },
      canFetchPast: true,
      fetchPast: () => {},
    }),
  }))
