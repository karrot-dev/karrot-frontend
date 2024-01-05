<template>
  <QDialog
    maximized
    persistent
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
        <template v-if="true">
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
        </template>
        <template v-else>
          <QToggle
            v-model="videoEnabled"
            icon="videocam"
            size="lg"
          />
          <QToggle
            v-model="audioEnabled"
            icon="fas fa-microphone"
            size="lg"
          />
        </template>
        <QBtn
          flat
          size="md"
          icon="fas fa-cog"
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
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script setup>
import { QBtn, QDialog, QCard, QCardSection, QSeparator, QToggle, QMenu } from 'quasar'
import { computed, onMounted, ref } from 'vue'

import { useMediaDeviceService, useRoomService, useTrackPublisher } from '@/meet/helpers'

import AudioDeviceSelect from '@/meet/components/AudioDeviceSelect.vue'
import Participant from '@/meet/components/Participant.vue'
import VideoDeviceSelect from '@/meet/components/VideoDeviceSelect.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

const participantsEl = ref(null)

const toolbar = ref(null)
const toolbarHeight = computed(() => toolbar.value?.$el?.offsetHeight ?? 0)

const showOptions = ref(false)
const optionsEnabled = computed(() => (videoEnabled.value && videoDevices.value?.length > 0) || (audioEnabled.value && audioDevices.value?.length > 0))

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

const oneParticipant = computed(() => participants.value?.length === 1)

onMounted(() => enable())

useTrackPublisher(room, videoTrack, 'video')
useTrackPublisher(room, audioTrack, 'audio')

function leave () {
  leaveRoom()
  disable()
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
