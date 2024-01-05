import { computed, unref } from 'vue'
import { useI18n } from 'vue-i18n'

import icons from '@/base/icons'
import { useActivePlaceService, usePlaceService, usePlaceStatusService, usePlaceTypeService } from '@/places/services'

export function usePlaceHelpers () {
  const { placeId: activePlaceId } = useActivePlaceService()
  const { getPlaceTypeById } = usePlaceTypeService()
  const { getPlaceStatusById } = usePlaceStatusService()
  const { getTranslatedName } = usePlaceTypeHelpers()
  const placeStatusHelpers = usePlaceStatusHelpers()

  function getIsActivePlace (place) {
    return activePlaceId.value === unref(place).id
  }

  const defaultPlaceIconProps = {
    name: 'fas fa-map-marker',
  }

  function getPlaceIconProps (place) {
    if (!place) return defaultPlaceIconProps
    const placeType = getPlaceTypeById(place.placeType)
    const placeStatus = getPlaceStatusById(place.status)
    if (!placeType || !placeStatus) {
      return defaultPlaceIconProps
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

export function usePlaceIconProps (place) {
  const { getPlaceIconProps } = usePlaceHelpers()
  return computed(() => getPlaceIconProps(unref(place)))
}

export function usePlaceStatusTranslatedName (placeStatus) {
  const { getTranslatedName } = usePlaceStatusHelpers()
  return computed(() => getTranslatedName(unref(placeStatus)))
}

export function usePlaceTypeTranslatedName (placeType) {
  const { getTranslatedName } = usePlaceTypeHelpers()
  return computed(() => getTranslatedName(unref(placeType)))
}

export function usePlaceType (placeTypeId) {
  const { getPlaceTypeById } = usePlaceTypeService()
  return computed(() => getPlaceTypeById(unref(placeTypeId)))
}

export function usePlaceTypes (groupId) {
  const { placeTypes } = usePlaceTypeService()
  return computed(() => {
    if (!placeTypes?.value) return []
    if (!groupId) return placeTypes.value
    if (!groupId.value) return []
    const groupIdValue = unref(groupId)
    return placeTypes.value?.filter(placeStatus => placeStatus.group === groupIdValue)
  })
}

export function usePlaceStatus (placeStatusId) {
  const { getPlaceStatusById } = usePlaceStatusService()
  return computed(() => getPlaceStatusById(unref(placeStatusId)))
}

export function usePlaceStatusColourName (placeStatus) {
  const { getColorName } = usePlaceStatusHelpers()
  return computed(() => getColorName(unref(placeStatus)))
}

export function usePlaceStatuses (groupId) {
  const { placeStatuses } = usePlaceStatusService()
  return computed(() => {
    if (!placeStatuses?.value) return []
    if (!groupId) return placeStatuses.value
    if (!groupId.value) return []
    const groupIdValue = unref(groupId)
    return placeStatuses.value?.filter(placeStatus => placeStatus.group === groupIdValue)
  })
}

export function usePlacesWithStatus (placeStatus) {
  const { places } = usePlaceService()
  return computed(() => {
    const statusId = unref(placeStatus)?.id
    if (!statusId) return []
    return places.value.filter(place => !place.isArchived && place.status === statusId)
  })
}
