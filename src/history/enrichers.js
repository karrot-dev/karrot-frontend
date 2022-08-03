import i18n from '@/base/i18n'
import { useUserService } from '@/users/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { usePlaceService } from '@/places/services'
import { useActivityTypeService } from '@/activities/services'
import { useActivityTypeEnricher } from '@/activities/enrichers'

export function useHistoryEnricher () {
  const { getPlaceById } = usePlaceService()
  const { getGroupById } = useGroupInfoService()
  const { getUserById } = useUserService()
  const { getActivityTypeById } = useActivityTypeService()
  const enrichActivityType = useActivityTypeEnricher()

  function enrichHistory (history) {
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
      const activityType = enrichActivityType(getActivityTypeById(history.payload.activityType))
      Object.assign(msgValues, {
        activityType: activityType.translatedName,
      })
    }
    else if ([
      'ACTIVITY_TYPE_CREATE',
      'ACTIVITY_TYPE_MODIFY',
    ].includes(history.typus) && history.after) {
      const { name, nameIsTranslatable } = history.after
      Object.assign(msgValues, {
        activityType: nameIsTranslatable ? i18n.t(`ACTIVITY_TYPE_NAMES.${name}`) : name,
      })
    }
    else {
      // Generic name incase the payload doesn't not provide activityType
      Object.assign(msgValues, {
        activityType: i18n.t('GROUP.ACTIVITY'),
      })
    }
    if (history.typus === 'APPLICATION_DECLINED') {
      Object.assign(msgValues, {
        applicantName: history.payload.applicantName,
      })
    }

    return {
      ...history,
      _enrichSource: history,

      users: history.users ? history.users.map(getUserById) : [],
      group: getGroupById(history.group),
      place,

      description: i18n.t(`HISTORY.${history.typus}`, msgValues),
    }
  }
  return enrichHistory
}
