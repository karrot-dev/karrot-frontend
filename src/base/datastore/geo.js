function initialState () {
  return {
    value: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    myCoordinates: state => {
      if (!state.value) return null
      const { lat, lng } = state.value
      return { lat, lng }
    },
    defaultCenter: (state, getters, rootState, rootGetters) => {
      const group = rootGetters['currentGroup/value']
      if (group && group.latitude && group.longitude) {
        return {
          lat: group.latitude,
          lng: group.longitude,
        }
      }
      return getters.myCoordinates || { lat: '49.8990022441358', lng: '8.66415739059448' }
    },
  },
  mutations: {
    set (state, value) {
      state.value = value
    },
  },
}
