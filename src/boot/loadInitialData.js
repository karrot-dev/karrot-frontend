import { VueQueryPlugin } from 'vue-query'

import { queryKeyActivityTypeListAll } from '@/activities/queries'
import { queryKeys } from '@/authuser/queries'
import bootstrap from '@/base/api/bootstrap'
import { setGeoipCoordinates } from '@/base/services/geo'
import { queryClient } from '@/base/vue-query'
import { queryKeyGroupInfoListAll } from '@/groupInfo/queries'
import { queryKeyPlaceListAll } from '@/places/queries'
import { queryKeyStatus } from '@/status/queries'
import { queryKeyUserListAll } from '@/users/queries'
import { configureSentry } from '@/utils/sentry'

export default async function ({ app }) {
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
}
