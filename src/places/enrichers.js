import { useStatusService } from '@/status/services'
import { optionsFor } from '@/places/placeStatus'
import { useActivePlaceService } from '@/places/services'
import { useGroupInfoService } from '@/groupInfo/services'

export function usePlaceEnricher () {
  const { getGroupById } = useGroupInfoService()
  const { placeId: activePlaceId } = useActivePlaceService()
  const { getPlaceStatus } = useStatusService()

  return place => {
    return {
      ...place,
      ui: optionsFor(place),
      group: getGroupById(place.group), // TODO: need to enrich it?
      // statistics: state.statistics[place.id], // TODO: I think I moved these out now...
      isActivePlace: place.id === activePlaceId.value,
      unreadWallMessageCount: getPlaceStatus(place.id).unreadWallMessageCount,
    }
    // TODO: implement enricher here...
    // return {
    //   ...place,
    //   ui: optionsFor(place),
    //   // group: rootGetters['groups/get'](place.group),
    //   // statistics: state.statistics[place.id],
    //   // isActivePlace: place.id === state.activePlaceId,
    // }
  }
}
