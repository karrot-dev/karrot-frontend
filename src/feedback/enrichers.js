// import { useStore } from 'vuex'
import { useUserService } from '@/users/services'
import { usePlaceService } from '@/places/services'
import { useActivityEnricher } from '@/activities/enrichers'

export function useFeedbackEnricher () {
  // const store = useStore()
  const { getUserById } = useUserService()
  const { getPlaceById } = usePlaceService()
  const enrichActivity = useActivityEnricher()

  function enrichFeedback (feedback) {
    // TODO: decouple from store
    // return store.getters['feedback/enrich'](feedback)

    // TODO: we don't have a list of all activities any more... what to do? they are passed in the query though, so maybe enrich there?
    // const activity = rootGetters['activities/get'](feedback.about)
    return {
      ...feedback,
      about: enrichActivity(feedback.about),
      givenBy: getUserById(feedback.givenBy), // TODO: enrich here too?
      place: getPlaceById(feedback.about?.place),
      // about: activity,
      // place: activity && activity.place,
      // group: activity && activity.group,
    }
  }
  return enrichFeedback
}
