import { useEnrichedUsers } from '@/activities/data/useUsers'
import { computed, unref } from '@vue/composition-api'
import reactiveNow from '@/utils/reactiveNow'
import { isWithinOneWeek, sortByDate } from '@/activities/datastore/activities'

export function useEnrichedActivities ({ activities, authUserId, getUser }) {
  const { enrichUser } = useEnrichedUsers({ authUserId })

  function enrichActivity (activity) {
    return {
      ...activity,
      __enriched: true, // maybe this is useful to know?
      isUserMember: activity.participants.includes(unref(authUserId)),
      isEmpty: activity.participants.length === 0,
      isFull: activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants,
      participants: activity.participants.map(getUser).map(enrichUser),
      // this causes recalculation on every reactiveNow change... maybe should computed it closer to the component?
      hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,
      // hasStarted: false,
    }
  }

  const enrichedActivities = computed(() => unref(activities).map(enrichActivity))

  // TODO: find out if these computed things get precalculated (then might want to seperate them), or only when used (best)

  // upcomingAndStarted: (state, getters) => {
  //   return Object.values(state.entries)
  //     .map(getters.enrich)
  //     .filter(p => p.dateEnd > reactiveNow.value)
  //     .sort(sortByDate)
  // },

  const upcomingAndStarted = computed(() => unref(enrichedActivities).filter(p => p.dateEnd > reactiveNow.value).sort(sortByDate))
  const joinedActivities = computed(() => unref(upcomingAndStarted).filter(item => item.isUserMember))

  // TODO: doesn't implement place favourites filter... .filter(e => e.place.isSubscribed)

  const availableActivities = computed(() => unref(upcomingAndStarted)
    .filter(isWithinOneWeek)
    .filter(e => !e.isFull && !e.isUserMember && !e.isDisabled && !e.hasStarted))

  // TODO: missing .filter(p => !p.feedbackGivenBy.find(u => u.isCurrentUser))
  // TODO: aha, there is another API call to get more feedback possible ones (listFeedbackPossible)..
  // so we might not have them all available here. should they go into their own useActivities module?
  const feedbackPossibleActivities = computed(() => unref(enrichedActivities)
    .filter(p => p.dateEnd < reactiveNow.value && p.feedbackDue > reactiveNow.value)
    .filter(p => p.isUserMember)
    .sort(sortByDate))

  return {
    enrichActivity,
    activities: enrichedActivities,
    enrichedActivities,
    upcomingAndStarted,
    joinedActivities,
    availableActivities,
    feedbackPossibleActivities,
  }
}
