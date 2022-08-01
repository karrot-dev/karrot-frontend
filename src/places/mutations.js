import { useMutation } from 'vue-query'

import api from './api/places'
import { withStatus } from '@/utils/queryHelpers'

export function usePlaceSubscribeMutation () {
  return withStatus(useMutation(placeId => api.subscribe(placeId)))
}

export function usePlaceUnsubscribeMutation () {
  return withStatus(useMutation(placeId => api.unsubscribe(placeId)))
}
