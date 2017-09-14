import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from './modules/auth'
import * as groups from './modules/groups'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    groups
  },
  strict: debug
})
