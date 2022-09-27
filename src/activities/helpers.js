import { useI18n } from 'vue-i18n'

import { useAuthService } from '@/authuser/services'
import icons from '@/base/icons'
import reactiveNow from '@/utils/reactiveNow'

export function useActivityHelpers () {
  const { userId } = useAuthService()
  const { t } = useI18n()

  function getIsUserParticipant (activity, participantType = null) {
    if (participantType) {
      return activity.participants.some(participant => participant.user === userId.value && participant.participantType === participantType.id)
    }
    else {
      return activity.participants.some(participant => participant.user === userId.value)
    }
  }

  function getIsEmpty (activity) {
    return activity.participants.length === 0
  }

  function getIsFull (activity, participantType) {
    if (!participantType) throw new Error('must specify participantType')
    if (!participantType.maxParticipants) return false
    const participantCount = activity.participants.filter(participant => participant.participantType === participantType.id).length
    return participantCount >= participantType.maxParticipants
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

  const roleOptions = [
    {
      label: t('ROLES.MEMBER'),
      value: 'member',
      description: t('ROLES.MEMBER_DESCRIPTION'),
    },
    {
      label: t('ROLES.NEWCOMER'),
      value: 'newcomer',
      description: t('ROLES.NEWCOMER_DESCRIPTION'),
    },
    /* Not adding this role yet until we have a way to trust for a specific role...
    {
      label: t('ROLES.APPROVED'),
      value: 'approved',
      description: t('ROLES.NEWCOMER_DESCRIPTION'),,
    },
     */
    {
      label: t('ROLES.EDITOR'),
      value: 'editor',
      description: t('ROLES.EDITOR_DESCRIPTION'),
    },
  ]

  return {
    getIsUserParticipant,
    getIsEmpty,
    getIsFull,
    getHasStarted,
    getIsUpcoming,
    getIsStartedOrUpcoming,
    roleOptions,
  }
}

export function useActivityTypeHelpers () {
  const { t } = useI18n()

  function getColorName (activityType) {
    if (!activityType) return
    const { id } = activityType
    return `activity-type-${id}`
  }

  function getTextClass (activityType) {
    return `text-${getColorName(activityType)}`
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
    getTextClass,
    getColorName,
    getTranslatedName,
    getIconProps,
    getFeedbackIconProps,
  }
}
