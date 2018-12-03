import datastore from './datastore'
import { isNetworkError } from '@/utils/datastore/helpers'

export default async function () {
  await datastore.dispatch('auth/refresh')
  datastore.dispatch('groups/fetch')

  fetchCommunityFeed()

  if (!__ENV.DEV) {
    datastore.dispatch('about/fetch')
  }
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
