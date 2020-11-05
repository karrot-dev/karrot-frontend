// eslint-disable-next-line no-unused-vars
import { watch, ref, unref, shallowReadonly, reactive, computed, provide, inject } from '@vue/composition-api'
import api from '@/status/api/status'
import deepmerge from 'deepmerge'
import { useEvents } from '@/activities/data/useEvents'

const injectionKey = Symbol('GlobalStatus')

export function provideStatus (status) {
  provide(injectionKey, status)
}

export function useStatus () {
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

function initialGroupState () {
  return {
    pendingApplicationCount: 0,
    feedbackPossibleCount: 0,
    unreadWallMessageCount: 0,
  }
}

function initialPlaceState () {
  return {
    unreadWallMessageCount: 0,
  }
}

function getRefs (status, initialState) {
  const refs = {}
  for (const key of Object.keys(initialState)) {
    refs[key] = computed(() => unref(status)[key] || initialState[key])
  }
  return refs
}

export function useGroupStatus ({ groupId }) {
  const { status } = useStatus()
  const groupStatus = computed(() => unref(status).groups[unref(groupId)] || {})
  return getRefs(groupStatus, initialGroupState())
}

export function usePlaceStatus ({ placeId }) {
  const { status } = useStatus()
  const placeStatus = computed(() => unref(status).places[unref(placeId)] || {})
  return getRefs(placeStatus, initialPlaceState())
}

export function createStatus ({ isLoggedIn }) {
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
