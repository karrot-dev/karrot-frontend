import subscriptionsAPI from '@/subscriptions/api/subscriptions'

export const plugin = datastore => {
  // Trigger setup after logging in
  // (logout handling is in auth/logout action)
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) datastore.dispatch('auth/push/setup')
  })

  // Ensure the server has the correct tokens
  datastore.watch((state) => state.auth.push.token, async (token, previousToken) => {
    if (!datastore.getters['auth/isLoggedIn']) return // we can't modify the server if we're not logged in

    const subscriptions = await subscriptionsAPI.list()

    if (previousToken) {
      const subscription = subscriptions.find(subscription => subscription.token === previousToken)
      if (subscription) await subscriptionsAPI.delete(subscription.id)
    }

    if (token) {
      const subscription = subscriptions.find(subscription => subscription.token === token)
      if (!subscription) await subscriptionsAPI.create({ token, platform: 'web' })
    }
  }, { immediate: true })
}
