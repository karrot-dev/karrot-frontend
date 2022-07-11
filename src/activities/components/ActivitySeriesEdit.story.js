<<<<<<< HEAD
// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

import { storiesOf } from '@storybook/vue'
=======
import { h } from 'vue'
import { storiesOf } from '@storybook/vue3'
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681
import { action } from '@storybook/addon-actions'

import { createDatastore, statusMocks, storybookDefaults as defaults } from '>/helpers'
import * as factories from '>/enrichedFactories'

const ActivitySeriesEdit = () => require('./ActivitySeriesEdit').default

const series = factories.makeActivitySeries()

const store = createDatastore({
  users: {
    getters: {
      byCurrentGroup: () => [],
    },
  },
})

storiesOf('ActivitySeriesEdit', module)
  .add('weekly', () => defaults({
    store,
    render () {
      return h(ActivitySeriesEdit(), {
        value: series,
        status: statusMocks.default(),
        onSave (diff) {
          action('save', diff)
        },
      })
    },
  }))
  .add('time error', () => defaults({
    store,
    render () {
      return h(ActivitySeriesEdit(), {
        value: series,
        status: statusMocks.validationError('startDate', 'time is in past'),
      })
    },
  }))
  .add('duration', () => defaults({
    store,
    render () {
      return h(ActivitySeriesEdit(), {
        value: {
          ...series,
          duration: 45 * 60,
        },
        status: statusMocks.default(),
      })
    },
  }))
  .add('custom rule', () => defaults({
    store,
    render () {
      return h(ActivitySeriesEdit(), {
        value: {
          ...series,
          rule: {
            ...series.rule,
            isCustom: true,
          },
        },
        status: statusMocks.default(),
      })
    },
  }))
  .add('custom rule with duration', () => defaults({
    store,
    render () {
      return h(ActivitySeriesEdit(), {
        value: {
          ...series,
          duration: 45 * 60,
          rule: {
            ...series.rule,
            isCustom: true,
          },
        },
        status: statusMocks.default(),
      })
    },
  }))
