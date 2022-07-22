// import { useLoginMutation } from '@/authuser/mutations'
import { defineService } from '@/utils/datastore/helpers'
import { useAuthUserQuery } from '@/authuser/queries'
import { computed } from 'vue'

export const useAuthService = defineService('authuser', () => {
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

  // actions
  async function refresh () {
    await refetch()
  }

  return {
    id,
    user,
    refresh,
  }
})
