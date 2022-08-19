import { unref } from 'vue'
import { useMutation } from 'vue-query'
import { useRouter } from 'vue-router'

import { placeRoute } from '@/places/utils'
import { withStatus } from '@/utils/queryHelpers'

import api from './api/places'

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

/*
async save ({ dispatch }, place) {
        dispatch('update', [await places.save(place)])
        router.push({ name: placeRoute(place), params: { placeId: place.id } }).catch(() => {})
      },
      async create ({ dispatch, rootGetters }, place) {
        const createdPlace = await places.create({
          ...place,
          group: rootGetters['currentGroup/id'],
        })
        dispatch('update', [createdPlace])
        router.push({ name: placeRoute(createdPlace), params: { placeId: createdPlace.id } }).catch(() => {})
      },
 */
