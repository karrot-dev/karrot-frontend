<template>
  <div>
    <h1>A call!</h1>
    <ul>
      <li
        v-for="participant in cameraParticipants"
        :key="participant.sid"
      >
        <strong>{{ participant.name }}</strong>
      </li>
    </ul>
    <div
      class="flex"
      style="gap: 10px"
    >
      <RoomParticipant
        v-for="participant in cameraParticipants"
        :key="participant.sid"
        :participant="participant"
      />
    </div>
    <pre>cameraParticipants: {{ cameraParticipants }}</pre>
  </div>
</template>

<script setup>
import { Room, RoomEvent } from 'livekit-client'
import { onMounted, onUnmounted, reactive, ref, watchEffect } from 'vue'

import api from '@/meet/api/meet'
import {
  useCameraParticipants,
  useRemoteAudioTracks,
  useRoomParticipants,
  useRoomParticipants2,
} from '@/meet/helpers'

import RoomParticipant from '@/meet/components/RoomParticipant.vue'

const token = ref(null)

const roomRef = ref(null)

// const participants = useRoomParticipants(roomRef)
// const participants2 = useRoomParticipants2(roomRef)
const cameraParticipants = useCameraParticipants(roomRef)

const audioTracksRef = useRemoteAudioTracks(roomRef)

watchEffect(() => {
  const audioTracks = audioTracksRef.value
  if (!audioTracks) return
  for (const audioTrack of audioTracks) {
    audioTrack.publication.track.attach()
  }
})

onUnmounted(() => {
  const audioTracks = audioTracksRef.value
  if (!audioTracks) return
  for (const audioTrack of audioTracks) {
    audioTrack.publication.track.detach()
  }
})

onMounted(async () => {
  token.value = await api.getToken()
  console.log('got a token!', token.value)

  // const wsURL = 'ws://192.168.1.176:7880'
  const wsURL = 'wss://192.168.1.176:47880'
  // const wsURL = 'ws://localhost:7880'
  const room = new Room({ adaptiveStream: false })

  // room = reactive(room)
  // Object.setPrototypeOf(room, Room.prototype)

  // nice idea to make them reactive BUT can't make classes themselves reactive I think
  // room.participants = reactive(room.participants)
  // room.localParticipant = reactive(room.localParticipant)

  // makeParticipantReactive(room.localParticipant)

  // for (const participant of room.participants) {
  //   makeParticipantReactive(participant)
  // }

  /*
  function makeParticipantReactive (participant) {
    for (const k of ['audioTracks', 'videoTracks', 'tracks']) {
      participant[k] = reactive(participant[k])
    }
  }
  */

  await room.prepareConnection(wsURL, token)

  // room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
  //   console.log('track subscribed!', track, publication, participant)
  //   track.attach(videoRef.value)
  // })
  //
  // room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
  //   console.log('track unsuibscribed', track, publication, participant)
  //   track.detach()
  // })

  room.on(RoomEvent.Connected, () => {
    console.log('connected!')
    // console.log('participants', room.participants)
    // console.log('localParticipant', room.localParticipant)
  })

  await room.connect(wsURL, token.value)
  // console.log('connected to room', room.name)

  roomRef.value = room

  await room.localParticipant.enableCameraAndMicrophone()

  // for (const [key, track] of room.localParticipant.videoTracks.entries()) {
  //   console.log('video track!', key, track)
  // }
})

onUnmounted(async () => {
  const room = roomRef.value
  if (!room) return
  await room.disconnect(true)
})

</script>
