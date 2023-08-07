import { convert } from '@/activities/api/activities'

import {
  createGroup,
  createPlace,
  createPlaceType,
  createActivity,
  createActivityType,
  createActivitySeries,
} from '>/mockBackend'
import { toResponse } from '>/mockBackend/activities'
import { statusMocks } from '>/statusMocks'

import ActivityEdit from './ActivityEdit.vue'

const group = createGroup()
createPlaceType({ group: group.id })
const place = createPlace({ group: group.id })
createActivityType({ group: group.id })
const activity = createActivity({ place: place.id })
const series = createActivitySeries({ place: place.id })

export default {
  component: ActivityEdit,
}

export const Normal = {
  // render,
  args: {
    value: convert(toResponse(activity)),
    series,
    status: statusMocks.default(),
  },
}

export const Disabled = {
  args: {
    value: {
      ...convert(toResponse(activity)),
      isDisabled: true,
    },
    series,
    status: statusMocks.default(),
  },
}

export const WithDuration = {
  args: {
    value: {
      ...convert(toResponse(activity)),
      hasDuration: true,
    },
    series,
    status: statusMocks.default(),
  },
}

export const SeriesChanged = {
  args: {
    value: {
      ...convert(toResponse(activity)),
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
  },
}

export const Pending = {
  args: {
    value: convert(toResponse(activity)),
    series,
    status: statusMocks.pending(),
  },
}

export const Error = {
  args: {
    value: convert(toResponse(activity)),
    series,
    status: statusMocks.validationError('date', 'Wrong time'),
  },
}
