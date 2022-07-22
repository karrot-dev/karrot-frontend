import { useStore } from 'vuex'

export function usePlaceEnricher () {
  const store = useStore()
  return place => {
    return store.getters['places/enrich'](place)
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
