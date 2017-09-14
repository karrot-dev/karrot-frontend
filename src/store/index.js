import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from './modules/auth'
import * as conversations from './modules/conversations'
import * as groups from './modules/groups'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const options = ({
  modules: {
    auth, conversations, groups
  },
  strict: debug
})

// Set all modules to be namespaces

for (let k of Object.keys(options.modules)) {
  let m = options.modules[k]

  // Enforce use of namespaced modules
  m.namespaced = true
}

export default new Vuex.Store(options)
