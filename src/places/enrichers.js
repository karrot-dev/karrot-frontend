import { useStore } from 'vuex'
import { useStatusService } from '@/status/services'

export function usePlaceEnricher () {
  const { getPlaceStatus } = useStatusService()

  const store = useStore()
  return place => {
    return {
      ...store.getters['places/enrich'](place),
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
