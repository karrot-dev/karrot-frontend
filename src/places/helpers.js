import { unref } from 'vue'
import { useI18n } from 'vue-i18n'

import icons from '@/base/icons'
import { useActivePlaceService, usePlaceStatusService, usePlaceTypeService } from '@/places/services'

export function usePlaceHelpers () {
  const { placeId: activePlaceId } = useActivePlaceService()
  const { getPlaceTypeById } = usePlaceTypeService()
  const { getPlaceStatusById } = usePlaceStatusService()
  const { getTranslatedName } = usePlaceTypeHelpers()
  const placeStatusHelpers = usePlaceStatusHelpers()

  function getIsActivePlace (place) {
    return activePlaceId.value === unref(place).id
  }

  function getPlaceIconProps (place) {
    const placeType = getPlaceTypeById(place.placeType)
    const placeStatus = getPlaceStatusById(place.status)
    if (!placeType || !placeStatus) {
      return {
        name: 'fas fa-map-marker',
      }
    }

    const { icon } = placeType

    const placeTypeName = getTranslatedName(placeType)
    const placeStatusName = placeStatusHelpers.getTranslatedName(placeStatus)

    return {
      name: icon,
      color: placeStatusHelpers.getColorName(placeStatus),
      title: `${placeTypeName}: ${placeStatusName}`,
    }
  }

  return {
    getIsActivePlace,
    getPlaceIconProps,
  }
}

export function usePlaceTypeHelpers () {
  const { t } = useI18n()

  function getTranslatedName (placeType) {
    if (!placeType) return
    const { name, nameIsTranslatable } = placeType
    return nameIsTranslatable ? t(`PLACE_TYPE_NAMES.${name}`) : name
  }

  function sortByTranslatedName (a, b) {
    return getTranslatedName(a).localeCompare(getTranslatedName(b))
  }

  function getIconProps (placeType) {
    if (!placeType) return { name: icons.get('place_fw') }

    const { icon } = placeType
    const title = getTranslatedName(placeType)
    return {
      name: icon,
      title,

      // can use this in QFabAction if we set "icon" and "label" props...
      // QIcon seems to be OK with these being set too...
      icon,
      label: title,
    }
  }

  return {
    getTranslatedName,
    sortByTranslatedName,
    getIconProps,
  }
}

export function usePlaceStatusHelpers () {
  const { t } = useI18n()
  function getTranslatedName (placeStatus) {
    if (!placeStatus) return
    const { name, nameIsTranslatable } = placeStatus
    return nameIsTranslatable ? t(`PLACE_STATUS_NAMES.${name}`) : name
  }

  function sortByTranslatedName (a, b) {
    return getTranslatedName(a).localeCompare(getTranslatedName(b))
  }

  function getColorName (placeStatus) {
    if (!placeStatus) return
    const { id } = placeStatus
    return `place-status-${id}`
  }

  return {
    getTranslatedName,
    sortByTranslatedName,
    getColorName,
  }
}
