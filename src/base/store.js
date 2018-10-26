import Vue from 'vue'
import Vuex from 'vuex'

import conversationsPlugin from '@/messages/datastore/conversationsPlugin'
import persistedState from '@/base/datastore/persistedState'
import i18nPlugin from '@/base/datastore/i18nPlugin'
import router from '@/base/datastore/routerPlugin'
import loadingProgressReporter from '@/topbar/datastore/loadingProgressReporter'
import dependentState from '@/base/datastore/dependentState'

// Alphabetical
import about, { plugin as aboutPlugin } from '@/utils/datastore/about'
import agreements from '@/agreements/datastore/agreements'
import auth, { plugin as authPlugin } from '@/authuser/datastore/auth'
import { plugin as authPushPlugin } from '@/subscriptions/datastore/auth/push'
import banners from '@/alerts/datastore/banners'
import notifications, { plugin as notificationsPlugin } from '@/notifications/datastore/notifications'
import breadcrumbs from '@/topbar/datastore/breadcrumbs'
import communityFeed from '@/communityFeed/datastore/communityFeed'
import connectivity from '@/utils/datastore/connectivity'
import conversations from '@/messages/datastore/conversations'
import currentGroup from '@/group/datastore/currentGroup'
import currentThread from '@/messages/datastore/currentThread'
import deleteAccount from '@/authuser/datastore/deleteAccount'
import detail, { plugin as detailPlugin } from '@/messages/datastore/detail'
import fcm, { plugin as fcmPlugin } from '@/subscriptions/datastore/fcm'
import feedback from '@/feedback/datastore/feedback'
import groupApplications from '@/applications/datastore/groupApplications'
import groups from '@/groupInfo/datastore/groups'
import history from '@/history/datastore/history'
import i18n from '@/base/datastore/i18n'
import invitations from '@/invitations/datastore/invitations'
import latestMessages, { plugin as latestMessagesPlugin } from '@/messages/datastore/latestMessages'
import loadingprogress from '@/topbar/datastore/loadingprogress'
import pickups, { plugin as pickupsPlugin } from '@/pickups/datastore/pickups'
import pickupSeries from '@/pickups/datastore/pickupSeries'
import presence from '@/utils/datastore/presence'
import refresh from '@/utils/datastore/refresh'
import route from '@/base/datastore/route'
import routeError from '@/base/datastore/routeError'
import search from '@/topbar/datastore/search'
import sidenavBoxes from '@/sidenav/datastore/sidenavBoxes'
import stores from '@/stores/datastore/stores'
import timezones from '@/group/datastore/timezones'
import toasts from '@/alerts/datastore/toasts'
import users, { plugin as usersPlugin } from '@/users/datastore/users'
import verifymail from '@/authuser/datastore/verifymail'

Vue.use(Vuex)

const debug = __ENV.DEV

export default new Vuex.Store({
  modules: {
    // Alphabetical, too
    about,
    agreements,
    auth,
    banners,
    notifications,
    breadcrumbs,
    communityFeed,
    connectivity,
    conversations,
    currentGroup,
    currentThread,
    deleteAccount,
    detail,
    fcm,
    feedback,
    groupApplications,
    groups,
    history,
    i18n,
    invitations,
    latestMessages,
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
    detailPlugin,
    i18nPlugin,
    persistedState,
    router,
    loadingProgressReporter,
    dependentState,
    fcmPlugin,
    authPushPlugin,
    aboutPlugin,
    usersPlugin,
    pickupsPlugin,
    latestMessagesPlugin,
    authPlugin,
    notificationsPlugin,
  ],
  strict: debug,
})
