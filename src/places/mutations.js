import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { unref } from 'vue'
import { useRouter } from 'vue-router'

import { placeRoute } from '@/places/utils'
import { withStatus } from '@/utils/queryHelpers'

import placeStatusAPI from './api/placeStatuses'
import placeTypeAPI from './api/placeTypes'
import api from './api/places'
import { queryKeyPlaceStatusListAll, queryKeyPlaceTypeListAll } from './queries'

export function usePlaceSubscribeMutation () {
  return withStatus(useMutation({
    mutationFn: placeId => api.subscribe(placeId),
  }))
}

export function usePlaceUnsubscribeMutation () {
  return withStatus(useMutation({
    mutationFn: placeId => api.unsubscribe(placeId),
  }))
}

export function useCreatePlaceMutation ({ groupId }) {
  const router = useRouter()
  return withStatus(useMutation({
    mutationFn: place => api.create({ ...place, group: unref(groupId) }),
    async onSuccess (place) {
      await router.push({ name: placeRoute(place), params: { placeId: place.id } })
    },
  }))
}

export function useSavePlaceMutation () {
  const router = useRouter()
  return withStatus(useMutation({
    mutationFn: place => api.save(place),
    async onSuccess (place) {
      await router.push({ name: placeRoute(place), params: { placeId: place.id } })
    },
  }))
}

// TODO what about websocket place type updates?
export function useCreatePlaceTypeMutation ({ groupId }) {
  const queryClient = useQueryClient()
  return withStatus(useMutation({
    mutationFn: placeType => placeTypeAPI.create({ ...placeType, group: unref(groupId) }),
    async onSuccess () {
      await queryClient.invalidateQueries(queryKeyPlaceTypeListAll())
    },
  }))
}

export function useSavePlaceTypeMutation () {
  const queryClient = useQueryClient()
  return withStatus(useMutation({
    mutationFn: placeType => placeTypeAPI.save(placeType),
    async onSuccess () {
      await queryClient.invalidateQueries(queryKeyPlaceTypeListAll())
    },
  }))
}

export function useCreatePlaceStatusMutation ({ groupId }) {
  const queryClient = useQueryClient()
  return withStatus(useMutation({
    mutationFn: placeStatus => placeStatusAPI.create({ ...placeStatus, group: unref(groupId) }),
    async onSuccess () {
      await queryClient.invalidateQueries(queryKeyPlaceStatusListAll())
    },
  }))
}

export function useSavePlaceStatusMutation () {
  const queryClient = useQueryClient()
  return withStatus(useMutation({
    mutationFn: placeStatus => placeStatusAPI.save(placeStatus),
    async onSuccess () {
      await queryClient.invalidateQueries(queryKeyPlaceStatusListAll())
    },
  }))
}
