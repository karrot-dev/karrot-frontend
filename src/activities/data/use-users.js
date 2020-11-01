import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import { ref, unref, provide, inject, reactive, shallowRef, markRaw } from '@vue/composition-api'
import userAPI from '@/users/api/users'

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

export function useEnrichedUsers ({ authUserId }) {
  return {
    enrichUser (user) {
      return {
        ...user,
        isCurrentUser: user.id === unref(authUserId),
      }
    },
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
    const user = reactive({ id })
    users[id] = user
    // TODO: this would need to be a lot fancier... to get in bulk, and maybe also checking we don't have a list query in progress
    // .. and also update from elsewhere...
    api.users.get(id).then(data => {
      for (const key in data) {
        Vue.set(user, key, data[key])
      }
    }) // errors?
    return user
  }

  return {
    getUser,
  }
}
