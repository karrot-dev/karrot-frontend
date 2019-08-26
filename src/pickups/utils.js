import dateFnsHelper from '@/utils/dateFnsHelper'
import addSeconds from 'date-fns/addSeconds'

const oneHourInSeconds = 60 * 60

function secondsInWordsStrict (seconds) {
  const date = new Date()
  return dateFnsHelper.formatDistanceStrict(addSeconds(date, seconds), date)
}

export function formatSeconds (seconds) {
  // formatDistanceStrict will render 1.5 hours as 1 hour, so we need to do a bit more work...
  const hoursAsSeconds = Math.floor(seconds / oneHourInSeconds) * oneHourInSeconds
  const remainderSeconds = seconds % oneHourInSeconds
  const parts = [hoursAsSeconds, remainderSeconds]
  return parts.filter(part => part > 0).map(secondsInWordsStrict).join(' ')
}
