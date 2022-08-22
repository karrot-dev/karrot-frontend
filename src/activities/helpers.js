import { useAuthService } from '@/authuser/services'
import icons from '@/base/icons'
import reactiveNow from '@/utils/reactiveNow'
import { useI18n } from 'vue-i18n'

export function useActivityHelpers () {
  const { userId } = useAuthService()

  function getIsUserMember (activity) {
    return activity.participants.includes(userId.value)
  }

  function getIsEmpty (activity) {
    return activity.participants.length === 0
  }

  function getIsFull (activity) {
    return activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants
  }

  function getHasStarted (activity) {
    return activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value
  }

  function getIsUpcoming (activity) {
    return activity.date > reactiveNow.value
  }

  function getIsStartedOrUpcoming (activity) {
    return activity.dateEnd > reactiveNow.value
  }

  return {
    getIsUserMember,
    getIsEmpty,
    getIsFull,
    getHasStarted,
    getIsUpcoming,
    getIsStartedOrUpcoming,
  }
}

export function useActivityTypeHelpers () {
  const { t } = useI18n()

  function getColorName (activityType) {
    if (!activityType) return
    const { id } = activityType
    return `activity-type-${id}`
  }

  function getTranslatedName (activityType) {
    if (!activityType) return
    const { name, nameIsTranslatable } = activityType
    return nameIsTranslatable ? t(`ACTIVITY_TYPE_NAMES.${name}`) : name
  }

  function getIconProps (activityType) {
    if (!activityType) return { name: icons.get('activity_fw') }

    const { icon } = activityType
    const title = getTranslatedName(activityType)
    return {
      name: icon,
      color: getColorName(activityType),
      title,

      // can use this in QFabAction if we set "icon" and "label" props...
      // QIcon seems to be OK with these being set too...
      // TODO: make sure it's OK to use with QIcon, otherwise create a getFabActionProps function...
      icon,
      label: title,
    }
  }

  function getFeedbackIconProps (activityType) {
    if (!activityType) return
    const { feedbackIcon } = activityType
    return {
      ...getIconProps(activityType),
      name: feedbackIcon,
    }
  }

  return {
    getColorName,
    getTranslatedName,
    getIconProps,
    getFeedbackIconProps,
  }
}
