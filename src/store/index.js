import Vue from 'vue'
import Vuex from 'vuex'
import persistedState from './plugins/persistedState'
import i18nPlugin from './plugins/i18n'
import router from './plugins/router'
import loadingProgressReporter from './plugins/loadingProgressReporter'
import dependentState from './plugins/dependentState'
import presenceReporter from './plugins/presenceReporter'

// Alphabetical
import about from './modules/about'
import agreements from './modules/agreements'
import alerts from './modules/alerts'
import auth from './modules/auth'
import breadcrumbs from './modules/breadcrumbs'
import chatFloaters from './modules/chatFloaters'
import conversations from './modules/conversations'
import currentGroup from './modules/currentGroup'
import fcm, { plugin as fcmPlugin } from './modules/fcm'
import feedback from './modules/feedback'
import groups from './modules/groups'
import history from './modules/history'
import i18n from './modules/i18n'
import invitations from './modules/invitations'
import loadingprogress from './modules/loadingprogress'
import pickups from './modules/pickups'
import pickupSeries from './modules/pickupSeries'
import presence from './modules/presence'
import route from './modules/route'
import routeError from './modules/routeError'
import search from './modules/search'
import sidenavBoxes from './modules/sidenavBoxes'
import stores from './modules/stores'
import timezones from './modules/timezones'
import users from './modules/users'
import verifymail from './modules/verifymail'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    // Alphabetical, too
    about,
    agreements,
    alerts,
    auth,
    breadcrumbs,
    chatFloaters,
    conversations,
    currentGroup,
    fcm,
    feedback,
    groups,
    history,
    i18n,
    invitations,
    loadingprogress,
    pickups,
    pickupSeries,
    presence,
    route,
    routeError,
    search,
    sidenavBoxes,
    stores,
    timezones,
    users,
    verifymail,
  },
  plugins: [
    i18nPlugin,
    persistedState,
    router,
    loadingProgressReporter,
    dependentState,
    fcmPlugin,
    presenceReporter,
  ],
  strict: debug,
})
