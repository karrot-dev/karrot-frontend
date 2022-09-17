import { unref } from 'vue'
import { useMutation, useQueryClient } from 'vue-query'
import { useRouter } from 'vue-router'

import { placeRoute } from '@/places/utils'
import { withStatus } from '@/utils/queryHelpers'

import placeTypeAPI from './api/placeTypes'
import api from './api/places'
import { queryKeyPlaceTypeListAll } from './queries'

export function usePlaceSubscribeMutation () {
  return withStatus(useMutation(placeId => api.subscribe(placeId)))
}

export function usePlaceUnsubscribeMutation () {
  return withStatus(useMutation(placeId => api.unsubscribe(placeId)))
}

export function useCreatePlaceMutation ({ groupId }) {
  const router = useRouter()
  return withStatus(useMutation(
    place => api.create({ ...place, group: unref(groupId) }),
    {
      onSuccess (place) {
        router.push({ name: placeRoute(place), params: { placeId: place.id } })
      },
    },
  ))
}

export function useSavePlaceMutation () {
  const router = useRouter()
  return withStatus(useMutation(
    place => api.save(place),
    {
      onSuccess (place) {
        router.push({ name: placeRoute(place), params: { placeId: place.id } })
      },
    },
  ))
}

// TODO what about websocket place type updates?
export function useCreatePlaceTypeMutation ({ groupId }) {
  const queryClient = useQueryClient()
  return withStatus(useMutation(
    placeType => placeTypeAPI.create({ ...placeType, group: unref(groupId) }),
    {
      onSuccess () {
        queryClient.invalidateQueries(queryKeyPlaceTypeListAll())
      },
    },
  ))
}

export function useSavePlaceTypeMutation () {
  const queryClient = useQueryClient()
  return withStatus(useMutation(
    placeType => placeTypeAPI.save(placeType),
    {
      onSuccess () {
        queryClient.invalidateQueries(queryKeyPlaceTypeListAll())
      },
    },
  ))
}
