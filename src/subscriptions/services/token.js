import { watch, unref } from 'vue'

import { useAuthService } from '@/authuser/services'
import subscriptionsAPI from '@/subscriptions/api/subscriptions'
import { defineService } from '@/utils/datastore/helpers'

export const useTokenService = defineService(() => {
  const { isLoggedIn } = useAuthService()

  let tokenRef = null

  // Ensure the server has the correct tokens
  // This is abstracted out so it can be used by browser push and cordova
  function syncToken (token, { platform }) {
    if (tokenRef) throw new Error('you can only have one token')
    tokenRef = token
    watch(
      () => [unref(token), unref(isLoggedIn)],
      async ([currentValue], [previousValue] = []) => {
        if (!isLoggedIn.value) return // we can't modify the server if we're not logged in
        if (!currentValue && !previousValue) return // nothing to do
        if (currentValue === previousValue) return // presumably nothing to do

        const subscriptions = await subscriptionsAPI.list()

        if (previousValue && previousValue !== currentValue) {
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

  // Remove token from the server
  // This is useful if you are logging out, don't want to keep pushing messages!
  async function deleteToken () {
    const tokenValue = tokenRef && unref(tokenRef)
    if (!tokenValue) return
    const subscriptions = await subscriptionsAPI.list()
    const subscription = subscriptions.find(subscription => subscription.token === tokenValue)
    if (subscription) await subscriptionsAPI.delete(subscription.id)
  }

  return {
    syncToken,
    deleteToken,
  }
})
