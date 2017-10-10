import pickupSeries from '@/services/api/pickupSeries'
import i18n from '@/i18n'

export const types = {
  REQUEST_LIST: 'Request List',
  RECEIVE_LIST: 'Receive List',
  RECEIVE_LIST_ERROR: 'Receive List Error',
  CLEAR_LIST: 'Clear List',
}

function initialState () {
  return {
    entries: {},
    idList: [],
    idListStoreId: null,
    error: null,
  }
}
export const state = initialState()

const DAY_INDEX = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].reduce((acc, key, idx) => {
  acc[key] = idx
  return acc
}, {})

function dayRuleToDate (key) {
  const date = new Date()
  date.setDate(date.getDate() - date.getDay() + DAY_INDEX[key])
  return date
}

export const getters = {
  get: (state, getters, rootState, rootGetters) => id => {
    return getters.enrich(state.entries[id])
  },
  enrich: (state, getters, rootState, rootGetters) => entry => {
    const pickups = rootGetters['pickups/all'].filter(pickup => pickup.series === entry.id)
    const dayNames = entry.rule.byDay.map(dayRuleToDate).map(date => i18n.d(date, 'dayName'))
    return entry && {
      ...entry,
      dayNames,
      pickups,
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idList.map(getters.get)
  },
}

export const actions = {

  async fetchListForActiveStore ({ commit, rootGetters }) {
    commit(types.REQUEST_LIST)
    try {
      let storeId = rootGetters['stores/activeStoreId']
      commit(types.RECEIVE_LIST, { list: await pickupSeries.listByStoreId(storeId), storeId })
    }
    catch (error) {
      commit(types.RECEIVE_LIST_ERROR, { error })
    }
  },

  clearList ({ commit }) {
    commit(types.CLEAR_LIST)
  },

}

export const mutations = {
  [types.REQUEST_LIST] (state) {},
  [types.RECEIVE_LIST] (state, { list, storeId }) {
    let entries = {}
    let ids = []
    for (let entry of list) {
      entries[entry.id] = entry
      ids.push(entry.id)
    }
    state.entries = entries
    state.idList = ids
    state.idListStoreId = storeId
    state.error = null
  },
  [types.RECEIVE_LIST_ERROR] (state, { error }) {
    state.error = error.message
  },
  [types.CLEAR_LIST] (state) {
    state.entries = {}
    state.idList = []
    state.idListStoreId = null
    state.error = null
  },
}
