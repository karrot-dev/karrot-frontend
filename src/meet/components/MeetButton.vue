<template>
  <QBtn
    v-if="hasMeet && endpoint && subject && (roomActive || (!sidenav && !hideWhenInactive))"
    icon="videocam"
    no-caps
    v-bind="sidenav ? {flat: true, dense: true} : {}"
    style="sidenav && 'padding-top: 0; padding-bottom: 0;'"
    :class="{ 'no-margin': sidenav, 'pulsate': roomActive }"
    :style="{ opacity: roomActive ? 1 : 0.8 }"
    @click="joinRoom(subject)"
  >
    <template v-if="roomActive">
      <QTooltip>
        <div
          v-for="user in roomUsers"
          :key="user.id"
        >
          {{ user.displayName }}
        </div>
      </QTooltip>
      <template v-if="sidenav">
        {{ room.participants.length }}
      </template>
      <QBadge
        v-else
        color="green"
        floating
        rounded
      >
        {{ room.participants.length }}
      </QBadge>
    </template>
  </QBtn>
</template>
<script setup>
import { QBtn, QBadge, QTooltip } from 'quasar'
import { computed } from 'vue'

import { useHasFeature } from '@/group/services'
import { useLivekitEndpoint, useRoomService } from '@/meet/helpers'
import { useRoomListQuery } from '@/meet/queries'
import { useUserService } from '@/users/services'

const props = defineProps({
  subject: {
    type: String,
    default: null,
  },
  hideWhenInactive: {
    type: Boolean,
    default: false,
  },
  sidenav: {
    type: Boolean,
    default: false,
  },
})

const endpoint = useLivekitEndpoint()
const hasMeet = useHasFeature('meet')
const { joinRoom } = useRoomService()

const { rooms } = useRoomListQuery()
const { getUserById } = useUserService()

const room = computed(() => rooms.value?.find(r => r.subject === props.subject))
const roomActive = computed(() => room.value?.participants.length > 0)
const roomUsers = computed(() => {
  if (!room.value) return []
  // Participants are not necessarily unique users
  const userIds = {}
  for (const participant of room.value.participants) {
    userIds[participant.user] = true
  }
  return Object.keys(userIds).map(getUserById)
})

</script>

<style lang="sass" scoped>
@keyframes pulsating
  0%
    transform: scale(1, 1)

  50%
    transform: scale(1.05, 1.05)

  100%
    transform: scale(1, 1)

.pulsate
  animation: pulsating 1s linear infinite
</style>
