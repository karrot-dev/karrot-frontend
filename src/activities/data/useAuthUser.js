import { ref, provide, inject, unref, computed } from '@vue/composition-api'
import { useEnrichedUsers } from '@/activities/data/useUsers'

const key = Symbol('AuthUser')

export function provideAuthUser (authUser) {
  provide(key, authUser)
}

export function useAuthUser () {
  return inject(key)
}

export function createUseAuthUser () {
  const authUser = ref(null)
  const authUserId = computed(() => authUser.value && authUser.value.id)
  const { enrichUser } = useEnrichedUsers({ authUserId })
  function setAuthUser (user) {
    authUser.value = user === undefined ? null : user
  }
  return {
    authUser: computed(() => enrichUser(unref(authUser))),
    authUserId: authUserId,
    setAuthUser,
    isLoggedIn: computed(() => {
      return authUser.value !== null
    }),
  }
}
