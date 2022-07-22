import reactiveNow from '@/utils/reactiveNow'
import { useUserEnricher } from '@/users/enrichers'
import { useAuthService } from '@/authuser/services'
import { useUserService } from '@/users/services'
import { usePlaceEnricher } from '@/places/enrichers'
import { usePlaceService } from '@/places/services'
import { useActivityService } from '@/activities/services'
import i18n from '@/base/i18n'

export function useActivityEnricher () {
  const { getUserById } = useUserService()
  const { getPlaceById } = usePlaceService()
  const { id: userId } = useAuthService()
  const { getActivityTypeById } = useActivityService()
  const enrichUser = useUserEnricher()
  const enrichPlace = usePlaceEnricher()
  const enrichActivityType = useActivityTypeEnricher()

  function enrichActivity (activity) {
    return {
      ...activity,
      _enricherSource: activity,

      // calculated values
      isUserMember: activity.participants.includes(userId.value),
      isEmpty: activity.participants.length === 0,
      isFull: activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants,
      hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,

      // related objects
      // group
      activityType: enrichActivityType(getActivityTypeById(activity.activityType)),
      place: enrichPlace(getPlaceById(activity.place)),
      // TODO: do we need enriched users here or not?
      feedbackGivenBy: activity.feedbackGivenBy.map(getUserById).map(enrichUser),
      feedbackDismissedBy: activity.feedbackDismissedBy.map(getUserById).map(enrichUser),
      participants: activity.participants.map(getUserById).map(enrichUser),
    }
  }

  return enrichActivity
}

export function useActivityTypeEnricher () {
  function enrichActivityType (activityType) {
    const { id, icon, feedbackIcon, name, nameIsTranslatable } = activityType
    // this corresponds to the name used by the activity type stylesheet plugin
    const colorName = `activity-type-${id}`
    const translatedName = nameIsTranslatable ? i18n.t(`ACTIVITY_TYPE_NAMES.${name}`) : name
    return {
      ...activityType,
      _enricherSource: activityType,

      translatedName,
      colorName,
      iconProps: {
        name: icon,
        color: colorName,
        title: translatedName,
      },
      feedbackIconProps: {
        name: feedbackIcon,
        color: colorName,
        title: translatedName,
      },
    }
  }

  return enrichActivityType
}
