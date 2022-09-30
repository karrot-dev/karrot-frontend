import { useI18n } from 'vue-i18n'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { usePlaceService } from '@/places/services'

export function useHistoryHelpers () {
  const { t } = useI18n()

  const { getPlaceById } = usePlaceService()
  const { getActivityTypeById } = useActivityTypeService()

  const { getTranslatedName } = useActivityTypeHelpers()

  function getHistoryDescription (history) {
    const place = getPlaceById(history.place)

    const msgValues = {}
    if (place) {
      Object.assign(msgValues, {
        placeName: place.name,
        storeName: place.name,
        name: place.name,
      })
    }
    if (history.payload && history.payload.activityType) {
      const activityType = getActivityTypeById(history.payload.activityType)
      Object.assign(msgValues, {
        activityType: getTranslatedName(activityType),
      })
    }
    else if ([
      'ACTIVITY_TYPE_CREATE',
      'ACTIVITY_TYPE_MODIFY',
    ].includes(history.typus) && history.after) {
      const { name, nameIsTranslatable } = history.after
      Object.assign(msgValues, {
        activityType: nameIsTranslatable ? t(`ACTIVITY_TYPE_NAMES.${name}`) : name,
      })
    }
    else {
      // Generic name incase the payload doesn't not provide activityType
      Object.assign(msgValues, {
        activityType: t('GROUP.ACTIVITY'),
      })
    }
    if (history.typus === 'APPLICATION_DECLINED') {
      Object.assign(msgValues, {
        applicantName: history.payload.applicantName,
      })
    }
    else if (history.typus === 'MEMBER_GOT_ROLE') {
      msgValues.role = history.payload.role.displayName || history.payload.role.name
    }

    return t(`HISTORY.${history.typus}`, msgValues)
  }

  return {
    getHistoryDescription,
  }
}
