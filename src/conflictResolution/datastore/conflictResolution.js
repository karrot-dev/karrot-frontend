import router from '@/base/router'
import { withMeta } from '@/utils/datastore/helpers'


function initialState () {
  return {
    entries: {
      1: {
        'id': 1,
        'submitDate': '',
        'group': 13,
        'ppp': 4,
        'initiator': 1,
        'initialStatement': 'He is so unreliable and I cannot stand him!',
      },
    },
  }
}
export default {
  state: initialState(),
  getters: {
    get: (state, getters) => conflictId => {
      return getters.enrich(state.entries[conflictId])
    },
  },
}
