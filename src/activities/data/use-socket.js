import { socketEvents } from '@/boot/socket'
import { onUnmounted } from '@vue/composition-api'

export function useSocket () {
  return {
    on (topic, callback) {
      socketEvents.$on(topic, callback)
      onUnmounted(() => {
        socketEvents.$off(topic, callback)
      })
    },
  }
}
