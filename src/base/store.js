import Vue from 'vue'
import Vuex from 'vuex'

import feedback from '@/feedback/datastore'
import utils from '@/utils/datastore'
import messages from '@/messages/datastore'
import topbar from '@/topbar/datastore'
import base from '@/base/datastore'
import agreements from '@/agreements/datastore'
import authuser from '@/authuser/datastore'
import subscriptions from '@/subscriptions/datastore'
import alerts from '@/alerts/datastore'
import notifications from '@/notifications/datastore'
import communityFeed from '@/communityFeed/datastore'
import group from '@/group/datastore'
import applications from '@/applications/datastore'
import groupInfo from '@/groupInfo/datastore'
import history from '@/history/datastore'
import invitations from '@/invitations/datastore'
import pickups from '@/pickups/datastore'
import sidenav from '@/sidenav/datastore'
import stores from '@/stores/datastore'
import users from '@/users/datastore'

const appModules = [
  feedback,
  utils,
  messages,
  topbar,
  base,
  agreements,
  authuser,
  subscriptions,
  alerts,
  notifications,
  communityFeed,
  group,
  applications,
  groupInfo,
  history,
  invitations,
  pickups,
  sidenav,
  stores,
  users,
]

Vue.use(Vuex)

const collectedModules = {}
const collectedPlugins = []

appModules.forEach(({ modules = {}, plugins = [] }) => {
  Object.assign(collectedModules, modules)
  collectedPlugins.push(...plugins)
})

console.log('collected modules', collectedModules)

const debug = __ENV.DEV

export default new Vuex.Store({
  modules: collectedModules,
  plugins: collectedPlugins,
  strict: debug,
})
