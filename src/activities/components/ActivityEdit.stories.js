import { h } from 'vue'

import { statusMocks } from '>/helpers'
import {
  createGroup,
  createPlace,
  createActivity,
  createActivityType,
  createActivitySeries,
} from '>/mockBackend'

import ActivityEdit from './ActivityEdit'
// const ActivityEdit = () => require('./ActivityEdit').default

const group = createGroup()
const place = createPlace({ group: group.id })
createActivityType({ group: group.id })
const activity = createActivity({ place: place.id })
const series = createActivitySeries({ place: place.id })

export default {
  component: ActivityEdit,
}

const Template = (args) => ({
  setup () {
    return () => h(ActivityEdit, args)
  },
})

export const Normal = Template.bind({})

Normal.args = {
  value: activity,
  series,
  status: statusMocks.default(),
}

/*
storiesOf('ActivityEdit', module)
  .add('default', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: activity,
        series,
        status: statusMocks.default(),
      })
    },
  }))
  .add('disabled', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: {
          ...activity,
          isDisabled: true,
        },
        series,
        status: statusMocks.default(),
      })
    },
  }))
  .add('with duration', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: {
          ...activity,
          hasDuration: true,
        },
        series,
        status: statusMocks.default(),
      })
    },
  }))
  .add('series changed', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: {
          ...activity,
          seriesMeta: {
            isMaxParticipantsChanged: true,
            isDescriptionChanged: true,
          },
        },
        series: {
          ...series,
          description: 'other',
          maxParticipants: 1,
        },
        status: statusMocks.default(),
      })
    },
  }))
  .add('pending', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: activity,
        series,
        status: statusMocks.pending(),
      })
    },
  }))
  .add('error', () => defaults({
    store,
    render () {
      return h(ActivityEdit(), {
        value: activity,
        series,
        status: statusMocks.validationError('date', 'Wrong time'),
      })
    },
  }))
*/
