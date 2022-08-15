import { createStore } from 'vuex'

// alphabetical
import alerts from '@/alerts/datastore'
import applications from '@/applications/datastore'
import authuser from '@/authuser/datastore'
import base from '@/base/datastore/base'
import communityFeed from '@/communityFeed/datastore'
import group from '@/group/datastore'
import groupInfo from '@/groupInfo/datastore'
import invitations from '@/invitations/datastore'
import issues from '@/issues/datastore'
import messages from '@/messages/datastore'
import notifications from '@/notifications/datastore'
import subscriptions from '@/subscriptions/datastore'
import unsubscribe from '@/unsubscribe/datastore'
import users from '@/users/datastore'
import utils from '@/utils/datastore'

// alphabetical
const appModules = [
  alerts,
  applications,
  authuser,
  base,
  communityFeed,
  group,
  groupInfo,
  invitations,
  issues,
  messages,
  notifications,
  subscriptions,
  unsubscribe,
  users,
  utils,
]

const collectedModules = {}
const collectedPlugins = []

appModules.forEach(({ modules = {}, plugins = [] }) => {
  Object.assign(collectedModules, modules)
  collectedPlugins.push(...plugins)
})

const debug = process.env.DEV

export default createStore({
  modules: collectedModules,
  plugins: collectedPlugins,
  strict: debug,
})
