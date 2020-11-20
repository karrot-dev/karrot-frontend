import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import { ref, unref, provide, inject, reactive, shallowRef, markRaw, computed, isReactive } from '@vue/composition-api'
import userAPI from '@/users/api/users'
// eslint-disable-next-line no-unused-vars
import { useEnrichedCurrentGroup } from '@/activities/data/useCurrentGroup'

const api = {
  users: userAPI,
}

const key = Symbol('GlobalUsers')

export function provideGlobalUsers (users) {
  provide(key, users)
}

export function useGlobalUsers () {
  return inject(key)
}

export function useEnrichedUsers ({ authUserId, getUser }) {
  // const { memberships } = useEnrichedCurrentGroup() // TODO: hmmm... lots of depending on current stuff now...
  function enrichUser (user) {
    return reactive({
      ...user,
      isCurrentUser: user.id === unref(authUserId),
      displayName: user.displayName || '?',
      // TODO: I wonder if this is an enrichmene too far...
      // membership: unref(memberships)[unref(authUserId)],
    })
  }
  function getEnrichedUser (id) {
    if (!getUser) throw new Error('getUser was not provided to useEnrichedUsers')
    return enrichUser(getUser(id))
  }
  return {
    enrichUser,
    getEnrichedUser,
  }
}

const pendingUsers = []

function fetchPendingUsers () {
  if (pendingUsers.length === 0) return

  // immediately copy and truncate so we don't double fetch
  const usersToFetch = [...pendingUsers]
  pendingUsers.length = 0

  console.log('could fetch', usersToFetch.length, 'users at once!!')
  for (const user of usersToFetch) {
    api.users.get(user.id).then(data => {
      for (const key in data) {
        Vue.set(user, key, data[key])
      }
      console.log('user is reactive?', isReactive(user))
      user.__state = 'found'
      Vue.set(user, 'displayName', computed(() => {
        return '+' + data.displayName
      }))
    }).catch(() => {
      // console.log('error getting user!', error)
      user.__state = 'notfound' // TODO: not true! could be a different error.. should check for 404
    })
  }
}

export function useUsers () {
  // we don't need reactive if we're just using getUser
  // as we return the reactive object... :)
  const users = {}

  function getUser (id) {
    if (users[id]) {
      return users[id]
    }
    const user = reactive({
      id,
      __state: 'initial',
    })
    users[id] = user
    pendingUsers.push(user)
    Vue.nextTick(fetchPendingUsers)
    return user
  }

  return {
    getUser,
  }
}
