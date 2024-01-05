import { convert } from '@/activities/api/activities'
import { defineStory } from '@/utils/storybookUtils'

import {
  createGroup,
  createPlace,
  createPlaceType,
  createActivity,
  createActivityType,
  createActivitySeries,
} from '>/mockBackend'
import { toActivityResponse } from '>/mockBackend/activities'
import { statusMocks } from '>/statusMocks'

import ActivityEdit from './ActivityEdit.vue'

function generateMockData () {
  const group = createGroup()
  createPlaceType({ group: group.id })
  const place = createPlace({ group: group.id })
  createActivityType({ group: group.id })
  const activity = createActivity({ place: place.id })
  const disabledActivity = createActivity({ place: place.id, isDisabled: true })
  const activityWithDuration = createActivity({ place: place.id, hasDuration: true })
  const series = createActivitySeries({ place: place.id })
  return {
    activity,
    disabledActivity,
    activityWithDuration,
    series,
  }
}

export default {
  component: ActivityEdit,
}

export const Normal = defineStory(() => {
  const { activity, series } = generateMockData()
  return {
    value: convert(toActivityResponse(activity)),
    series,
    status: statusMocks.default(),
  }
})

export const Disabled = defineStory(() => {
  const { disabledActivity, series } = generateMockData()
  return {
    value: convert(toActivityResponse(disabledActivity)),
    series,
    status: statusMocks.default(),
  }
})

export const WithDuration = defineStory(() => {
  const { activityWithDuration, series } = generateMockData()
  return {
    value: convert(toActivityResponse(activityWithDuration)),
    series,
    status: statusMocks.default(),
  }
})

export const SeriesChanged = defineStory(() => {
  const { activity, series } = generateMockData()
  return {
    value: {
      ...convert(toActivityResponse(activity)),
      // TODO seriesMeta does not exist on activity anymore - figure out some other solution
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
})

export const Pending = defineStory(() => {
  const { activity, series } = generateMockData()
  return {
    value: convert(toActivityResponse(activity)),
    series,
    status: statusMocks.pending(),
  }
})

export const Error = defineStory(() => {
  const { activity, series } = generateMockData()
  return {
    value: convert(toActivityResponse(activity)),
    series,
    status: statusMocks.validationError('date', 'Wrong time'),
  }
})
