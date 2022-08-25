import { unref } from 'vue'
import { useI18n } from 'vue-i18n'

import { optionsFor } from '@/places/placeStatus'
import { useActivePlaceService } from '@/places/services'

export function usePlaceHelpers () {
  const { t } = useI18n()
  const { placeId: activePlaceId } = useActivePlaceService()

  function getIsActivePlace (place) {
    return activePlaceId.value === unref(place).id
  }

  function getPlaceIconProps (place) {
    const { icon, color, label } = optionsFor(place)
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
