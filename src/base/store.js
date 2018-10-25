import Vue from 'vue'
import Vuex from 'vuex'

import conversationsPlugin from '@/messages/datafoo/conversationsPlugin'
import persistedState from '@/base/datafoo/persistedState'
import i18nPlugin from '@/base/datafoo/i18nPlugin'
import router from '@/base/datafoo/routerPlugin'
import loadingProgressReporter from '@/utils/datafoo/loadingProgressReporter'
import dependentState from '@/base/datafoo/dependentState'

// Alphabetical
import about, { plugin as aboutPlugin } from '@/utils/datafoo/about'
import agreements from '@/agreements/datafoo/agreements'
import auth, { plugin as authPlugin } from '@/authuser/datafoo/auth'
import { plugin as authPushPlugin } from '@/subscriptions/datafoo/auth/push'
import banners from '@/alerts/datafoo/banners'
import notifications, { plugin as notificationsPlugin } from '@/notifications/datafoo/notifications'
import breadcrumbs from '@/topbar/datafoo/breadcrumbs'
import communityFeed from '@/communityFeed/datafoo/communityFeed'
import connectivity from '@/utils/datafoo/connectivity'
import conversations from '@/messages/datafoo/conversations'
import currentGroup from '@/group/datafoo/currentGroup'
import currentThread from '@/messages/datafoo/currentThread'
import deleteAccount from '@/authuser/datafoo/deleteAccount'
import detail, { plugin as detailPlugin } from '@/messages/datafoo/detail'
import fcm, { plugin as fcmPlugin } from '@/subscriptions/datafoo/fcm'
import feedback from '@/feedback/datafoo/feedback'
import groupApplications from '@/applications/datafoo/groupApplications'
import groups from '@/groupInfo/datafoo/groups'
import history from '@/history/datafoo/history'
import i18n from '@/base/datafoo/i18n'
import invitations from '@/invitations/datafoo/invitations'
import latestMessages, { plugin as latestMessagesPlugin } from '@/messages/datafoo/latestMessages'
import loadingprogress from '@/utils/datafoo/loadingprogress'
import pickups, { plugin as pickupsPlugin } from '@/pickups/datafoo/pickups'
import pickupSeries from '@/pickups/datafoo/pickupSeries'
import presence from '@/utils/datafoo/presence'
import refresh from '@/utils/datafoo/refresh'
import route from '@/base/datafoo/route'
import routeError from '@/base/datafoo/routeError'
import search from '@/topbar/datafoo/search'
import sidenavBoxes from '@/sidenav/datafoo/sidenavBoxes'
import stores from '@/stores/datafoo/stores'
import timezones from '@/group/datafoo/timezones'
import toasts from '@/alerts/datafoo/toasts'
import users, { plugin as usersPlugin } from '@/users/datafoo/users'
import verifymail from '@/authuser/datafoo/verifymail'

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
