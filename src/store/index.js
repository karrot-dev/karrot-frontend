import Vue from 'vue'
import Vuex from 'vuex'
import * as groups from './modules/groups'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    groups
  },
  strict: debug
})
