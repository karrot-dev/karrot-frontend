// Can't use the normal one as we've made random not random for tests...
// Only exists in Jest environment, so fall back to Math.random outside of it (e.g. Storybook)
import { isDate } from 'date-fns'

export function realSample (items) {
  const random = Math.realRandom || Math.random
  return items[Math.floor(random() * items.length)]
}

export function toAPIResponse (item) {
  const result = { ...item }
  for (const key of Object.keys(result)) {
    // Stringify dates as that's what the API does
    if (isDate(result[key])) {
      result[key] = String(result[key])
    }
  }
  return item
}
