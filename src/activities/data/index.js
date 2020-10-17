import activitiesCreator from '@/activities/data/activities-creator'

let globalActivities

export function useGlobalActivities () {
  if (!globalActivities) globalActivities = useActivities()
  return globalActivities
}

export function useActivities () {
  return activitiesCreator()
}
