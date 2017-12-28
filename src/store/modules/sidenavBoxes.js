import { withMeta, createMetaModule } from '@/store/helpers'

function initialState () {
  return {
    mapCollapsed: false,
    storeCollapsed: false,
    storesCollapsed: false,
    groupCollapsed: false,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    mapCollapsed: state => state.mapCollapsed,
    storeCollapsed: state => state.storeCollapsed,
    storesCollapsed: state => state.storesCollapsed,
    groupCollapsed: state => state.groupCollapsed,
  },
  actions: {
    ...withMeta({
      hideGroupSidenav ({ commit }) {
        console.log('test1')
        commit('hideGroup')
      },
      showGroupSidenav ({ commit }) {
        console.log('test2')
        commit('showGroup')
      },
    }),
  },
  mutations: {
    toggleMapCollapsed (state) { state.mapCollapsed = !state.mapCollapsed },
    toggleStoreCollapsed (state) { state.storeCollapsed = !state.storeCollapsed },
    toggleStoresCollapsed (state) { state.storesCollapsed = !state.storesCollapsed },
    toggleGroupCollapsed (state) { state.groupCollapsed = !state.groupCollapsed },
    hideGroup (state) { state.groupCollapsed = true },
    showGroup (state) { state.groupCollapsed = false },
  },
}

export const state = initialState()
