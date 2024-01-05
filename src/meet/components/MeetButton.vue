<template>
  <QBtn
    v-if="hasMeet && room"
    icon="videocam"
    no-caps
    @click="joinRoom(room)"
  />
</template>
<script setup>
import { QBtn } from 'quasar'

import { useHasFeature } from '@/group/services'
import { useRoomService } from '@/meet/helpers'

defineProps({
  room: {
    type: String,
    default: null,
  },
})

const hasMeet = useHasFeature('meet')
const { joinRoom } = useRoomService()
</script>
