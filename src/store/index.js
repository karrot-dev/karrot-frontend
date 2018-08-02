import Vue from 'vue'
import Vuex from 'vuex'

import conversationsPlugin from './plugins/conversations'
import persistedState from './plugins/persistedState'
import i18nPlugin from './plugins/i18n'
import router from './plugins/router'
import loadingProgressReporter from './plugins/loadingProgressReporter'
import dependentState from './plugins/dependentState'

// Alphabetical
import about, { plugin as aboutPlugin } from './modules/about'
import agreements from './modules/agreements'
import banners from './modules/banners'
import auth from './modules/auth'
import { plugin as authPushPlugin } from './modules/auth/push'
import breadcrumbs from './modules/breadcrumbs'
import communityFeed from './modules/communityFeed'
import conversations from './modules/conversations'
import currentGroup from './modules/currentGroup'
import currentThread from './modules/currentThread'
import deleteAccount from './modules/deleteAccount'
import detail from './modules/detail'
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
import refresh from './modules/refresh'
import route from './modules/route'
import routeError from './modules/routeError'
import search from './modules/search'
import sidenavBoxes from './modules/sidenavBoxes'
import stores from './modules/stores'
import timezones from './modules/timezones'
import toasts from './modules/toasts'
import users from './modules/users'
import verifymail from './modules/verifymail'

Vue.use(Vuex)

const debug = __ENV.DEV

export default new Vuex.Store({
  modules: {
    // Alphabetical, too
    about,
    agreements,
    banners,
    auth,
    breadcrumbs,
    communityFeed,
    conversations,
    currentGroup,
    currentThread,
    deleteAccount,
    detail,
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
    refresh,
    route,
    routeError,
    search,
    sidenavBoxes,
    stores,
    timezones,
    toasts,
    users,
    verifymail,
  },
  plugins: [
    conversationsPlugin,
    i18nPlugin,
    persistedState,
    router,
    loadingProgressReporter,
    dependentState,
    fcmPlugin,
    authPushPlugin,
    aboutPlugin,
  ],
  strict: debug,
})
