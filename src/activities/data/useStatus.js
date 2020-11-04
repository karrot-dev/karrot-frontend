// eslint-disable-next-line no-unused-vars
import { watch, ref, unref, shallowReadonly, reactive, computed, provide, inject } from '@vue/composition-api'
import api from '@/status/api/status'
import deepmerge from 'deepmerge'
import { useEvents } from '@/activities/data/useEvents'

const injectionKey = Symbol('GlobalStatus')

export function provideGlobalStatus (status) {
  provide(injectionKey, status)
}

export function useGlobalStatus () {
  return inject(injectionKey)
}

function initialState () {
  return {
    unseenConversationCount: 0,
    unseenThreadCount: 0,
    hasUnreadConversationsOrThreads: false,
    unseenNotificationCount: 0,
    /*
      {
        <id> : {
          pendingApplicationCount: 0,
          feedbackPossibleCount: 0,
          unreadWallMessageCount: 0
        }
      }
    */
    groups: {},
    /*
      {
        <id> {
          unreadWallMessageCount: 0
        }
      }
    */
    places: {},
  }
}

export function useGroupStatus ({ status, groupId }) {
  return {
    status: computed(() => {
      return unref(status).groups[unref(groupId)] || {
        pendingApplicationCount: 0,
        feedbackPossibleCount: 0,
        unreadWallMessageCount: 0,
      }
    }),
  }
}

export function usePlaceStatus ({ status, placeId }) {
  return {
    status: computed(() => {
      return unref(status).places[unref(placeId)] || {
        unreadWallMessageCount: 0,
      }
    }),
  }
}

export function useStatus ({ isLoggedIn }) {
  const status = ref(initialState())

  watch(() => unref(isLoggedIn), async isLoggedIn => {
    if (isLoggedIn) {
      update(await api.fetch())
    }
    else {
      clear()
    }
  }, { immediate: true })

  const { on } = useEvents()

  on('status', update)

  function update (data) {
    status.value = deepmerge(status.value, data)
  }

  function clear () {
    status.value = initialState()
  }

  return {
    status: shallowReadonly(status),
  }
}
