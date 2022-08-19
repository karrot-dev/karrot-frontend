import { QueryCache, QueryClient, VueQueryPlugin } from 'vue-query'

import { queryKeyActivityTypeListAll } from '@/activities/queries'
import { queryKeys } from '@/authuser/queries'
import bootstrap from '@/base/api/bootstrap'
import { setGeoipCoordinates } from '@/base/services/geo'
import { queryKeyGroupInfoListAll } from '@/groupInfo/queries'
import { queryKeyPlaceListAll } from '@/places/queries'
import { queryKeyStatus } from '@/status/queries'
import { queryKeyUserListAll } from '@/users/queries'
import { configureSentry } from '@/utils/sentry'

export default async function ({ app, store: datastore }) {
  const queryCache = new QueryCache({
    onError (error, query) {
      // This is a global error handler for queries if we need it
      console.error('query error for', query.queryKey, error)
    },
  })
  const queryClient = new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        // I mainly put this here because on logout it tries to refetch a load of stuff multiple times (places, users)
        // (even though I have the "enabled" option to only do that if it's logged in
        retry: false,
      },
    },
  })
  app.use(VueQueryPlugin, { queryClient })

  const {
    config,
    user,
    groups,
    places,
    users,
    status,
    activityTypes,
    geoip,
  } = await bootstrap.fetch([
    'config',
    'user',
    'groups',
    'places',
    'users',
    'status',
    'activity_types',
    'geoip',
  ])

  if (config) {
    if (config.sentry) {
      configureSentry(app, config.sentry)
    }
  }
  if (groups) {
    queryClient.setQueryData(queryKeyGroupInfoListAll(), groups)
  }
  if (user) {
    queryClient.setQueryData(queryKeys.authUser(), user)
  }
  if (places) {
    queryClient.setQueryData(queryKeyPlaceListAll(), places)
  }
  if (users) {
    queryClient.setQueryData(queryKeyUserListAll(), users)
  }
  if (status) {
    queryClient.setQueryData(queryKeyStatus(), status)
  }
  if (activityTypes) {
    queryClient.setQueryData(queryKeyActivityTypeListAll(), activityTypes)
  }
  if (geoip) {
    setGeoipCoordinates(geoip)
  }

  if (!process.env.DEV) {
    // TODO: implement about!
    datastore.dispatch('about/fetch')
  }
}
