// import { useLoginMutation } from '@/authuser/mutations'
import { defineService } from '@/utils/datastore/helpers'
import { useAuthUserQuery } from '@/authuser/queries'
import { computed, watch } from 'vue'
import { useStore } from 'vuex'

export const useAuthService = defineService(() => {
  // services
  const store = useStore()

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
  const id = computed(() => user.value?.id)
  const isLoggedIn = computed(() => !!user.value)

  // This is only temporary to cause us to reload our user here when the main store one is logged in/out
  // This can go away when we login using this service...
  // TODO: implement ability to log in using auth service/mutation/whatever so we don't need this
  watch(() => store.getters['auth/isLoggedIn'], () => refresh())

  watch(isLoggedIn, val => {
    console.log('user service islogged in?', val)
  })

  // actions
  async function refresh () {
    await refetch()
  }

  return {
    id,
    isLoggedIn,
    user,
    refresh,
  }
})
