import { defineService } from '@/utils/datastore/helpers'
import { useAuthUserQuery } from '@/authuser/queries'
import { computed } from 'vue'

export const useAuthService = defineService(() => {
  // queries
  const { user, refetch } = useAuthUserQuery()

  // mutations
  // const { mutate: login } = useLoginMutation()
  // have an action here that uses it?
  // then do stuff
  // - set locale
  // - accept invite? (are they still existing?)
  // - join group after login
  // - redirect to somewhere else
  // ACTUALLY, this is probably better off in the onSuccess of the login mutation
  // as we can return the mutation immediate, so the calling thing has status about it...

  // computed
  const userId = computed(() => user.value?.id)
  const isLoggedIn = computed(() => !!user.value)

  // actions
  async function refresh () {
    await refetch()
    // TODO: how to deal with this bit? (used to be done in the vuex store module)
    // const wasLoggedIn = getters.isLoggedIn
    // let user = null
    // try {
    //   user = await authUser.get()
    // }
    // catch (error) {}
    // commit('setUser', user)
    // commit('setMaybeLoggedOut', false)
    //
    // if (!user && wasLoggedIn && !getters.logoutStatus.pending) {
    //   dispatch('logout')
    // }
  }

  return {
    userId,
    isLoggedIn,
    user,
    refresh,
  }
})
