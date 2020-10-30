import { isNetworkError } from '@/utils/datastore/helpers'
import { camelizeKeys } from '@/utils/utils'

export default async function ({ store: datastore }) {
  // await datastore.dispatch('auth/refresh')
  // datastore.dispatch('groups/fetch')

  const bootstrapData = camelizeKeys(await fetch('/api/bootstrap/').then(res => res.json()))
  console.log('bootstrapData is', bootstrapData)
  if (bootstrapData.groupsInfo) {
    datastore.commit('groups/set', bootstrapData.groupsInfo)
  }
  if (bootstrapData.authUser) {
    datastore.commit('auth/setUser', bootstrapData.authUser)
    datastore.commit('auth/setMaybeLoggedOut', false)
  }
  if (bootstrapData.geoip) {
    console.log('geoip!!', bootstrapData.geoip)
    datastore.commit('geo/set', bootstrapData.geoip)
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
