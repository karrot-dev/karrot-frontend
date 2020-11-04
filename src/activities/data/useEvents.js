import Vue from 'vue'

import { onCacheExpired } from '@/activities/data/useCached'

const eventBus = new Vue()

export function send (topic, payload) {
  eventBus.$emit(topic, payload)
}

export function useEvents () {
  return {
    on (topic, callback) {
      console.log('subscribed something for', topic)
      eventBus.$on(topic, callback)
      onCacheExpired(() => {
        console.log('unsubscibed something for', topic)
        eventBus.$off(topic, callback)
      })
    },
  }
}
