import { isNetworkError } from '@/utils/datastore/helpers'
import bootstrap from '@/base/api/bootstrap'
import { configureSentry } from '@/utils/sentry'
import { QueryClient, VueQueryPlugin } from 'vue-query'
import { queryKeys } from '@/authuser/queries'

export default async function ({ app, store: datastore }) {
  const queryClient = new QueryClient()
  app.use(VueQueryPlugin, { queryClient })

  const bootstrapData = await bootstrap.fetch()
  const { config, user, groups, geoip } = bootstrapData
  if (config) {
    if (config.sentry) {
      configureSentry(app, config.sentry)
    }
  }
  if (groups) {
    datastore.commit('groups/set', groups)
  }
  if (user) {
    queryClient.setQueryData(queryKeys.authUser(), () => user)
    datastore.commit('auth/setUser', user)
    datastore.commit('auth/setMaybeLoggedOut', false)
  }
  if (geoip) {
    datastore.commit('geo/set', geoip)
  }

  async function fetchCommunityFeed () {
    try {
      await Promise.all([
        datastore.dispatch('communityFeed/fetchTopics'),
        datastore.dispatch('communityFeed/fetchBanner'),
      ])
    }
    catch (error) {
      console.warn('Could not fetch community feed topics.')
      // we only expect a network error or 404, otherwise tell Sentry
      const { response: { status = -1 } = {} } = error
      if (status !== 404 && !isNetworkError(error)) {
        throw error
      }
    }
  }

  fetchCommunityFeed()

  if (!process.env.DEV) {
    datastore.dispatch('about/fetch')
  }
}
