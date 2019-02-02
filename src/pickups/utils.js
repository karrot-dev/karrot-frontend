import dateFnsHelper from '@/utils/dateFnsHelper'
import addSeconds from 'date-fns/add_seconds'

import { pickupDurations } from '@/pickups/settings'

export function toDurationLabel (seconds) {
  const date = new Date()
  return dateFnsHelper.distanceInWordsStrict(date, addSeconds(date, seconds))
}

export function durationOptions () {
  return pickupDurations.map(duration => ({
    label: toDurationLabel(duration),
    value: duration,
  }))
}
