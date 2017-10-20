export const types = {
  MAP_STORES_TOGGLE: 'Map Stores Toggle',
  MAP_USERS_TOGGLE: 'Map Users Toggle',
}

function initialState () {
  return {
    map: {
      showStores: true,
      showUsers: false,
    },
  }
}

export const state = initialState()

export const getters = {
  showMapStores: state => state.map.showStores,
  showMapUsers: state => state.map.showUsers,
}

export const actions = {

  toggleMapStores ({ commit }) {
    commit(types.MAP_STORES_TOGGLE)
  },

  toggleMapUsers ({ commit }) {
    commit(types.MAP_USERS_TOGGLE)
  },

}

export const mutations = {
  [types.MAP_STORES_TOGGLE] (state) {
    state.map.showStores = !state.map.showStores
  },
  [types.MAP_USERS_TOGGLE] (state) {
    state.map.showUsers = !state.map.showUsers
  },
}
