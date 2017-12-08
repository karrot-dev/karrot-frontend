import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from './plugins/persistedState'
import i18nPlugin from './plugins/i18n'
import router from './plugins/router'
import loadingProgressReporter from './plugins/loadingProgressReporter'
import dependentState from './plugins/dependentState'

import * as stores from './modules/stores'
import * as users from './modules/users'
import * as pickups from './modules/pickups'
import * as pickupSeries from './modules/pickupSeries'
import * as sidenav from './modules/sidenav'
import * as verifymail from './modules/verifymail'
import * as route from './modules/route'
import * as invitations from './modules/invitations'
import * as loadingprogress from './modules/loadingprogress'
import * as search from './modules/search'
import * as routeError from './modules/routeError'
import about from './modules/about'
import agreements from './modules/agreements'
import alerts from './modules/alerts'
import auth from './modules/auth'
import breadcrumbs from './modules/breadcrumbs'
import conversations from './modules/conversations'
import currentGroup from './modules/currentGroup'
import fcm, { plugin as fcmPlugin } from './modules/fcm'
import groups from './modules/groups'
import history from './modules/history'
import i18n from './modules/i18n'
import timezones from './modules/timezones'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const options = ({
  modules: {
    auth,
    conversations,
    groups,
    currentGroup,
    timezones,
    stores,
    users,
    pickups,
    pickupSeries,
    i18n,
    sidenav,
    about,
    breadcrumbs,
    verifymail,
    route,
    invitations,
    alerts,
    loadingprogress,
    history,
    search,
    agreements,
    routeError,
    fcm,
  },
  plugins: [
    i18nPlugin,
    persistedState,
    router,
    loadingProgressReporter,
    dependentState,
    fcmPlugin,
  ],
  strict: debug,
})

// Set all modules to be namespaces

for (let k of Object.keys(options.modules)) {
  let m = options.modules[k]

  // Enforce use of namespaced modules
  m.namespaced = true
}

export default new Vuex.Store(options)
