export const types = {
  SET_ALL_BREADCRUMBS: 'Set all breadcrumbs',
}

export const state = {
  breadcrumbs: [
    { name: 'First', route: { name: 'store', params: { groupId: 1, storeId: 60 } } },
    { name: 'Last', route: { name: 'store', params: { groupId: 1, storeId: 60 } } }],
}

export const getters = {
  all: state => state.breadcrumbs,
}

export const actions = {

  setAll ({ commit }, { breadcrumbs }) {
    commit(types.SET_ALL_BREADCRUMBS, { breadcrumbs })
  },

}

export const mutations = {
  [types.SET_ALL_BREADCRUMBS] (state, { breadcrumbs }) {
    state.breadcrumbs = breadcrumbs
  },
}
