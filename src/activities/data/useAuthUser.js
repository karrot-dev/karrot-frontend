import { ref, provide, inject, shallowReadonly, computed } from '@vue/composition-api'

const key = Symbol('AuthUser')

export function provideGlobalAuthUser (authUser) {
  provide(key, authUser)
}

export function useGlobalAuthUser () {
  return inject(key)
}

export function useAuthUser () {
  const authUserId = ref(undefined)
  function setAuthUserId (id) {
    authUserId.value = id
    console.log('set authUserId to', authUserId.value)
  }
  return {
    authUserId: shallowReadonly(authUserId),
    setAuthUserId,
    isLoggedIn: computed(() => {
      return authUserId.value !== undefined
    }),
  }
}
