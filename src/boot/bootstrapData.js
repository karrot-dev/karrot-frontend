import { boot } from 'quasar/wrappers'

import { queryKeyActivityTypeListAll } from '@/activities/queries'
import { queryKeys } from '@/authuser/queries'
import bootstrap from '@/base/api/bootstrap'
import { queryKeyConfig } from '@/base/queries'
import queryClient from '@/base/queryClient'
import { setGeoipCoordinates } from '@/base/services/geo'
import { queryKeyGroupInfoListAll } from '@/groupInfo/queries'
import { queryKeyPlaceListAll } from '@/places/queries'
import { queryKeyStatus } from '@/status/queries'
import { queryKeyUserListAll } from '@/users/queries'
import { configureSentry } from '@/utils/errors'

export default async function ({ app }) {
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
    queryClient.setQueryData(queryKeyConfig(), config)
  }
  if (groups) {
    queryClient.setQueryData(queryKeyGroupInfoListAll(), groups)
  }
  if (places) {
    queryClient.setQueryData(queryKeyPlaceListAll(), places)
  }
  if (users) {
    queryClient.setQueryData(queryKeyUserListAll(), users)
  }
  if (activityTypes) {
    queryClient.setQueryData(queryKeyActivityTypeListAll(), activityTypes)
  }
  if (geoip) {
    setGeoipCoordinates(geoip)
  }
  if (status) {
    queryClient.setQueryData(queryKeyStatus(), status)
  }
  if (user) {
    queryClient.setQueryData(queryKeys.authUser(), user)
  }
}
