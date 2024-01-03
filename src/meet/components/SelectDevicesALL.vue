<template>
  <div>
    <div class="row items-center">
      <div class="text-h6 q-mb-sm">
        Select device
      </div>
      <QSpace />
      <QToggle
        v-model="videoEnabled"
        icon="videocam"
        size="xl"
      />
      <QToggle
        v-model="audioEnabled"
        icon="fas fa-microphone"
        size="xl"
      />
    </div>
    <div
      class="column"
      style="gap: 12px;"
    >
      <video
        v-if="videoEnabled"
        ref="videoRef"
        class="rounded-borders full-width"
      />
      <QSelect
        v-if="videoEnabled && videoDevices"
        v-model="videoDeviceId"
        label="Video"
        outlined
        :loading="videoLoading"
        emit-value
        map-options
        class="bg-white"
        :options="videoDevices.map(device => ({
          value: device.deviceId,
          label: device.label,
        }))"
      >
        <template #prepend>
          <QIcon name="videocam" />
        </template>
      </QSelect>
      <QSelect
        v-if="audioEnabled && audioDevices"
        v-model="audioDeviceId"
        label="Audio"
        outlined
        :loading="audioLoading"
        emit-value
        map-options
        class="bg-white"
        :error="!audioLoading && audioIsSilent"
        error-message="No sound detected"
        :options="audioDevices.map(device => ({
          value: device.deviceId,
          label: device.label,
        }))"
      >
        <template #prepend>
          <QIcon name="fas fa-microphone" />
        </template>
        <template
          v-if="!audioIsSilent && !audioLoading"
          #append
        >
          <div
            style="width: 5px; top: 12px; bottom: 12px; margin-right: 10px;"
            class="bg-grey-2 absolute rounded-borders"
          >
            <div
              :style="{ height: `${audioVolume * 100}%` }"
              class="absolute-bottom bg-green-4 full-width rounded-borders"
            />
          </div>
          <!-- just a spacer -->
          <div style="width: 6px;" />
        </template>
      </QSelect>
    </div>

    <div class="q-my-sm">
      <QBtn
        v-if="room"
        label="Leave room"
        unelevated
        outline
        @click="leaveRoom"
      />
      <QBtn
        v-else
        label="Join room"
        unelevated
        outline
        @click="joinRoom"
      />
    </div>

    <div
      class="row q-col-gutter-sm"
    >
      <div
        v-for="participant in participants"
        :key="participant.identity"
        class="col-6 col-sm-4 col-lg-3"
      >
        <Participant
          :participant="participant"
        />
      </div>
    </div>
    <pre>participants: {{ participants }}</pre>
    <pre>cameraParticipants: {{ cameraParticipants }}</pre>
  </div>
</template>

<script setup>
import { LocalVideoTrack } from 'livekit-client'
import { QIcon, QBtn, QSelect, QToggle, QSpace } from 'quasar'
import { onMounted, onUnmounted, watch, watchEffect } from 'vue'

import {
  useCameraParticipants,
  useMediaDevices,
  useRemoteAudioTrackAttacher,
  useRemoteAudioTracks,
  useRoom,
  useTrackPublisher,
} from '@/meet/helpers'

import Participant from '@/meet/components/Participant.vue'
import RoomParticipant from '@/meet/components/RoomParticipant.vue'

const {
  reset,

  videoDevices,
  audioDevices,

  videoDeviceId,
  audioDeviceId,

  videoEnabled,
  audioEnabled,

  videoLoading,
  audioLoading,

  videoTrack,
  audioTrack,

  videoRef,

  audioVolume,
  audioIsSilent,
} = useMediaDevices({
  enabled: true,
})

const { joinRoom, leaveRoom, room, participants } = useRoom()

const cameraParticipants = useCameraParticipants(room)

// onMounted(async () => {
//   await joinRoom()
// })

useTrackPublisher(room, videoTrack, 'video')
useTrackPublisher(room, audioTrack, 'audio')

// useRemoteAudioTrackAttacher(room)

onUnmounted(async () => {
  await leaveRoom()
  reset()
})

</script>

<style scoped lang="sass">
video
  aspect-ratio: 4/3
  object-fit: cover
</style>
