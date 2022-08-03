import reactiveNow from '@/utils/reactiveNow'

export function hasStarted (activity) {
  return activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value
}

export function isUpcoming (activity) {
  return activity.date > reactiveNow.value
}

export function isStartedOrUpcoming (activity) {
  return activity.dateEnd > reactiveNow.value
}
