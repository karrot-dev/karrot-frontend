import { unref } from 'vue'
import { useI18n } from 'vue-i18n'

import icons from '@/base/icons'
import { optionsFor } from '@/places/placeStatus'
import { useActivePlaceService, usePlaceTypeService } from '@/places/services'

export function usePlaceHelpers () {
  const { t } = useI18n()
  const { placeId: activePlaceId } = useActivePlaceService()
  const { getPlaceTypeById } = usePlaceTypeService()

  function getIsActivePlace (place) {
    return activePlaceId.value === unref(place).id
  }

  function getPlaceIconProps (place) {
    const { color, label } = optionsFor(place)
    const { icon } = getPlaceTypeById(place.placeType)

    return {
      name: icon,
      color,
      title: t(label),
    }
  }

  function sortByPlaceStatus (a, b) {
    return optionsFor(a).sort - optionsFor(b).sort
  }

  return {
    getIsActivePlace,
    getPlaceIconProps,
    sortByPlaceStatus,
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
