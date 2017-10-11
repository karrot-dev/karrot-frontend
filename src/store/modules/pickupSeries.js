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

const DAY_KEYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
const DAY_INDEX = DAY_KEYS.reduce((acc, key, idx) => {
  acc[key] = idx
  return acc
}, {})

function dayKeyToDate (key) {
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
    const dayNames = entry.rule.byDay.map(dayKeyToDate).map(date => i18n.d(date, 'dayName'))
    return entry && {
      ...entry,
      dayNames,
      pickups,
      __unenriched: entry,
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idList.map(getters.get)
  },
  dayNames: () => {
    return DAY_KEYS.map(dayKeyToDate).map(date => i18n.d(date, 'dayName'))
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
