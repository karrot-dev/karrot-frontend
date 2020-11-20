import { useEnrichedUsers } from '@/activities/data/useUsers'
import { computed, unref, reactive } from '@vue/composition-api'
import reactiveNow from '@/utils/reactiveNow'
import { isWithinOneWeek, sortByDate } from '@/activities/datastore/activities'

export function useEnrichedActivities ({ activities, authUserId, getUser }) {
  // const { enrichUser } = useEnrichedUsers({ authUserId })

  // function enrichActivity (activity) {
  //   console.log('enriching activity', activity.id)
  //   return reactive({
  //     ...activity,
  //     __enriched: true, // maybe this is useful to know?
  //     isUserMember: computed(() => {
  //       console.log('enriching isUserMember', activity.id)
  //       return activity.participants.includes(unref(authUserId))
  //     }),
  //     isEmpty: computed(() => activity.participants.length === 0),
  //     isFull: computed(() => activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants),
  //     participants: computed(() => activity.participants.map(getUser).map(enrichUser)),
  //     // this causes recalculation on every reactiveNow change... maybe should computed it closer to the component?
  //     hasStarted: computed(() => activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value),
  //     // hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,
  //     // hasStarted: false,
  //     enriched: computed(() => {
  //       console.log('recalcaulting enriched details', activity.id)
  //       return {
  //         isUserMember: activity.participants.includes(unref(authUserId)),
  //         isEmpty: activity.participants.length === 0,
  //         isFull: activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants,
  //         participants: activity.participants.map(getUser).map(enrichUser),
  //         // this causes recalculation on every reactiveNow change... maybe should computed it closer to the component?
  //         hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,
  //       }
  //     }),
  //   })
  // }

  // const enrichedActivities = computed(() => {
  //   const items = unref(activities)
  //   console.log('enriching activity list', items.length)
  //   return items.map(enrichActivity)
  // })
  const enrichedActivities = activities

  // TODO: find out if these computed things get precalculated (then might want to seperate them), or only when used (best)
  // yay, theydon't

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
    // enrichActivity,
    activities: enrichedActivities,
    enrichedActivities,
    upcomingAndStarted,
    joinedActivities,
    availableActivities,
    feedbackPossibleActivities,
  }
}

export function useEnrichActivity ({ authUserId, getUser }) {
  const { enrichUser } = useEnrichedUsers({ authUserId })

  function enrichActivityFn (activity) {
    return {
      isEmpty: activity.participants.length === 0,
      isFull: activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants,
      participants: activity.participants.map(getUser).map(enrichUser),
      isUserMember: activity.participants.includes(unref(authUserId)),
      hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,
    }
  }

  function enrichActivity (activity) {
    console.log('enriching activity', activity.id)
    return reactive({
      // ah, if we want the activity passed in to be reactive, then this doesn't work...
      ...activity, // or maybe it does, is that passing down the reactivity??/
      // __enriched: true, // maybe this is useful to know?
      // Oh, we always get the new activity when it changes, so we don't need the computed's unless it's for an external thing...?

      isEmpty: computed(() => activity.participants.length === 0),
      isFull: computed(() => activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants),
      participants: computed(() => activity.participants.map(getUser).map(enrichUser)),
      isUserMember: computed(() => activity.participants.includes(unref(authUserId))),
      hasStarted: computed(() => activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value),

      // isEmpty: activity.participants.length === 0,
      // isFull: activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants,
      // participants: activity.participants.map(getUser).map(enrichUser),
      // isUserMember: activity.participants.includes(unref(authUserId)),
      // hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,

      // this causes recalculation on every reactiveNow change... maybe should computed it closer to the component?
      // hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,
      // hasStarted: false,
      // enriched: computed(() => {
      //   console.log('recalcaulting enriched details', activity.id)
      //   return {
      //     isUserMember: activity.participants.includes(unref(authUserId)),
      //     isEmpty: activity.participants.length === 0,
      //     isFull: activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants,
      //     participants: activity.participants.map(getUser).map(enrichUser),
      //     // this causes recalculation on every reactiveNow change... maybe should computed it closer to the component?
      //     hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,
      //   }
      // }),
    })
  }

  return {
    enrichActivity,
    enrichActivityFn,
  }
}
