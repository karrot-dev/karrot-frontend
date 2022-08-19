import { watch, unref } from 'vue'

import { useAuthService } from '@/authuser/services'
import subscriptionsAPI from '@/subscriptions/api/subscriptions'
import { defineService } from '@/utils/datastore/helpers'

export const useTokenService = defineService(() => {
  const { isLoggedIn } = useAuthService()

  // Ensure the server has the correct tokens
  // This is abstracted out so it can be used by browser push and cordova
  function syncToken (token, { platform }) {
    watch(
      () => [unref(token), unref(isLoggedIn)],
      async ([currentValue], [previousValue] = []) => {
        if (!isLoggedIn.value) return // we can't modify the server if we're not logged in
        if (!currentValue && !previousValue) return // nothing to do

        const subscriptions = await subscriptionsAPI.list()

        if (previousValue) {
          const subscription = subscriptions.find(subscription => subscription.token === previousValue)
          if (subscription) await subscriptionsAPI.delete(subscription.id)
        }

        if (currentValue) {
          const subscription = subscriptions.find(subscription => subscription.token === currentValue)
          if (!subscription) await subscriptionsAPI.create({ token: currentValue, platform })
        }
      },
      { immediate: true },
    )
  }

  return {
    syncToken,
  }
})
