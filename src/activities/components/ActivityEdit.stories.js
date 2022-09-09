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

export const Disabled = Template.bind({})

Disabled.args = {
  value: {
    ...activity,
    isDisabled: true,
  },
  series,
  status: statusMocks.default(),
}

export const WithDuration = Template.bind({})

WithDuration.args = {
  value: {
    ...activity,
    hasDuration: true,
  },
  series,
  status: statusMocks.default(),
}

export const SeriesChanged = Template.bind({})
// TODO seriesMeta does not exist on activity anymore - figure out some other solution

SeriesChanged.args = {
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
}

export const Pending = Template.bind({})

Pending.args = {
  value: activity,
  series,
  status: statusMocks.pending(),
}

export const Error = Template.bind({})

Error.args = {
  value: activity,
  series,
  status: statusMocks.validationError('date', 'Wrong time'),
}
