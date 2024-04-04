<template>
  <MiniParticipant v-if="mini" />
  <QDialog
    maximized
    persistent
    :class="mini ? 'hidden' : ''"
    :model-value="true"
    @hide.stop.prevent="leave()"
  >
    <QCard class="no-margin bg-grey-10 text-white relative-position">
      <div
        v-if="!room"
        class="absolute-full text-white z-top flex flex-center"
      >
        <KSpinner />
      </div>

      <div
        v-if="screenshareParticipant"
        class="absolute-full z-top bg-red"
      >
        <ScreenShare :participant="screenshareParticipant" />
      </div>
      <QCardSection
        class="full-height overflow-hidden participants-section"
        :style="{ '--toolbar-height': `${toolbarHeight}px` }"
      >
        <div
          ref="participantsEl"
          class="participants full-height"
          :class="{ one: oneParticipant, multiple: true }"
        >
          <div
            v-for="participant in participants"
            :key="participant.identity"
          >
            <Participant
              class="participant"
              :participant="participant"
              :style="{
                border: `1px solid ${participant.isSpeaking ? 'white' : 'transparent'}`,
                transitionProperty: 'border',
                transitionDuration: '0.3s',
              }"
            />
          </div>
        </div>
      </QCardSection>
    </QCard>
  </QDialog>
  <QDialog
    :model-value="true"
    seamless
    position="bottom"
    @hide.stop.prevent="leave()"
  >
    <QCard
      style="width: 380px"
      class="no-margin"
    >
      <template v-if="optionsEnabled && showOptions">
        <QCardSection class="column q-col-gutter-md">
          <VideoDeviceSelect />
          <AudioDeviceSelect />
        </QCardSection>
        <QSeparator />
      </template>
      <QCardSection
        ref="toolbar"
        class="row items-center no-wrap justify-between"
      >
        <QBtn
          :icon="videoEnabled ? 'videocam' : 'videocam_off'"
          round
          :color="videoEnabled ? 'green' : 'white'"
          :text-color="videoEnabled ? 'white' : 'grey'"
          @click="videoEnabled = !videoEnabled"
        />
        <QBtn
          :icon="audioEnabled ? 'fas fa-microphone' : 'fas fa-microphone-slash'"
          round
          :color="audioEnabled ? 'green' : 'white'"
          :text-color="audioEnabled ? 'white' : 'grey'"
          @click="audioEnabled = !audioEnabled"
        />
        <QBtn
          size="md"
          round
          icon="screen_share"
          :color="screenshare ? 'green' : 'white'"
          :text-color="screenshare ? 'white' : 'grey'"
          @click="screenshare = !screenshare"
        />
        <QBtn
          flat
          size="md"
          icon="fas fa-cog"
          round
          color="primary"
          :disable="!optionsEnabled"
          @click="showOptions = !showOptions"
        />
        <QBtn
          no-caps
          icon="fas fa-phone-alt"
          color="red"
          unelevated
          round
          size="md"
        >
          <QMenu
            class="q-pa-sm"
            anchor="top right"
            self="bottom right"
          >
            <QBtn
              unelevated
              color="red"
              icon="fas fa-sign-out-alt"
              label="Leave"
              @click="leave()"
            />
          </QMenu>
        </QBtn>
        <QBtn
          no-caps
          dense
          :icon="mini ? 'fas fa-expand-alt' : 'fas fa-compress-alt'"
          text-color="grey"
          unelevated
          size="sm"
          @click="mini = !mini"
        />
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script setup>
import { QBtn, QDialog, QCard, QCardSection, QSeparator, QMenu } from 'quasar'
import { computed, onMounted, ref, watch } from 'vue'

import { useMediaDeviceService, useRoomService, useTrackPublisher } from '@/meet/helpers'

import AudioDeviceSelect from '@/meet/components/AudioDeviceSelect.vue'
import MiniParticipant from '@/meet/components/MiniParticipant.vue'
import Participant from '@/meet/components/Participant.vue'
import ScreenShare from '@/meet/components/ScreenShare.vue'
import VideoDeviceSelect from '@/meet/components/VideoDeviceSelect.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

const participantsEl = ref(null)

const toolbar = ref(null)
const toolbarHeight = computed(() => toolbar.value?.$el?.offsetHeight ?? 0)

const showOptions = ref(false)
const optionsEnabled = computed(() => (videoEnabled.value && videoDevices.value?.length > 0) || (audioEnabled.value && audioDevices.value?.length > 0))

const mini = ref(false)
const screenshare = ref(false)

const {
  enable,
  disable,
  videoDevices,
  audioDevices,
  videoEnabled,
  audioEnabled,
  videoTrack,
  audioTrack,
} = useMediaDeviceService()

const emit = defineEmits([
  'leave',
])

const { leaveRoom, room, participants } = useRoomService()

watch(screenshare, enabled => {
  room.value.localParticipant.setScreenShareEnabled(enabled)
})

const oneParticipant = computed(() => participants.value?.length === 1)

const screenshareParticipant = computed(() => participants.value.find(participant => participant.screenShareVideoMediaStreamTrack))

watch(screenshareParticipant, value => {
  if (value) {
    // Auto-switch them into full view if we have a screensharer
    mini.value = false
  }
})

onMounted(() => enable())

useTrackPublisher(room, videoTrack, 'video')
useTrackPublisher(room, audioTrack, 'audio')

async function leave () {
  disable()
  await leaveRoom()
  emit('leave')
}

</script>

<style scoped lang="sass">
.participants-section
  padding-bottom: calc(var(--toolbar-height) + 16px)
.participants
  height: 100%
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))
  gap: 16px
  place-content: safe center
  place-items: safe center
  overflow: auto
  > div
    width: 100%

  &.one
    // really want it so that individual items are never taller than the container
    // but can't seem to get it
    // this is a hack to fix that case when there is only 1 participant (i.e. YOU)
    max-width: calc(((100vh - var(--toolbar-height) - 16px - 16px) / 3) * 4)
    margin: 0 auto

</style>
