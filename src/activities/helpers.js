import { computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActivityTypeService } from '@/activities/services'
import { useAuthService } from '@/authuser/services'
import icons from '@/base/icons'
import { useCurrentGroupService } from '@/group/services'
import reactiveNow from '@/utils/reactiveNow'

export function useActivityHelpers () {
  const { userId } = useAuthService()
  const { group } = useCurrentGroupService()
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

  const roleOptions = computed(() => [
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
    ...(group.value?.roles.approved
      ? [{
          label: group.value.roles.approved.displayName,
          value: 'approved',
          description: group.value.roles.approved.description,
        }]
      : []),
    {
      label: t('ROLES.EDITOR'),
      value: 'editor',
      description: t('ROLES.EDITOR_DESCRIPTION'),
    },
  ])

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
    if (!activityType) return
    return `text-${getColorName(activityType)}`
  }

  function getTranslatedName (activityType) {
    if (!activityType) return
    const { name, nameIsTranslatable } = activityType
    return nameIsTranslatable ? t(`ACTIVITY_TYPE_NAMES.${name}`) : name
  }

  function sortByTranslatedName (a, b) {
    return getTranslatedName(a).localeCompare(getTranslatedName(b))
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
    sortByTranslatedName,
    getIconProps,
    getFeedbackIconProps,
  }
}

export function useActivityTypeTranslatedName (activityType) {
  const { getTranslatedName } = useActivityTypeHelpers()
  return computed(() => getTranslatedName(unref(activityType)))
}

export function useActivityTypes (groupId) {
  const { activityTypes } = useActivityTypeService()
  return computed(() => {
    if (!activityTypes?.value) return []
    if (!groupId) return activityTypes.value
    if (!groupId.value) return []
    const groupIdValue = unref(groupId)
    return activityTypes.value?.filter(placeStatus => placeStatus.group === groupIdValue)
  })
}
