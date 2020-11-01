import Vue from 'vue'

import { onUnmounted } from '@vue/composition-api'

const eventBus = new Vue()

export function send (topic, payload) {
  eventBus.$emit(topic, payload)
}

export function useEvents () {
  return {
    on (topic, callback) {
      eventBus.$on(topic, callback)
      onUnmounted(() => {
        eventBus.$off(topic, callback)
      })
    },
  }
}
