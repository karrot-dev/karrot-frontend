import { isNetworkError } from '@/utils/datastore/helpers'
import bootstrap from '@/base/api/bootstrap'
import { configureSentry } from '@/utils/sentry'

export default async function ({ store: datastore }) {
  const bootstrapData = await bootstrap.fetch()
  const { config, user, groups, geoip } = bootstrapData
  if (config) {
    if (config.sentry) {
      configureSentry(config.sentry)
    }
  }
  if (groups) {
    datastore.commit('groups/set', groups)
  }
  if (user) {
    datastore.commit('auth/setUser', user)
    datastore.commit('auth/setMaybeLoggedOut', false)
  }
  if (geoip) {
    datastore.commit('geo/set', geoip)
  }

  async function fetchCommunityFeed () {
    try {
      await datastore.dispatch('communityFeed/fetchTopics')
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
