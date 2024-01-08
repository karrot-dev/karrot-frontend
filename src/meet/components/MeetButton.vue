<template>
  <QBtn
    v-if="hasMeet && endpoint && room"
    icon="videocam"
    no-caps
    @click="joinRoom(room)"
  />
</template>
<script setup>
import { QBtn } from 'quasar'

import { useHasFeature } from '@/group/services'
import { useLivekitEndpoint, useRoomService } from '@/meet/helpers'

defineProps({
  room: {
    type: String,
    default: null,
  },
})

const endpoint = useLivekitEndpoint()
const hasMeet = useHasFeature('meet')
const { joinRoom } = useRoomService()
</script>
