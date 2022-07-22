import { useStore } from 'vuex'

export function useGroupEnricher () {
  const store = useStore()
  return group => {
    // TODO: what about groups/enrich .. have to distinguish...
    // this one is a bit complex to reimplement here for now...
    return store.getters['currentGroup/enrich'](group)
  }
}
