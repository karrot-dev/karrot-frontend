import { isNetworkError } from '@/utils/datastore/helpers'

export default async function ({ app, store: datastore }) {
  await datastore.dispatch('auth/refresh')
  datastore.dispatch('groups/fetch')

  console.log('app', app)

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
