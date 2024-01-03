<template>
  <div>
    <QBtn
      outline
      label="Select devices"
      @click="showDeviceSelection = true"
    />
    <QBtn
      outline
      label="Just join"
      @click="join"
    />
    <a
      href="https://192.168.1.175:47880"
      target="_blank"
    >https://192.168.1.175:47880</a>
  </div>
  <QDialog
    v-model="showDeviceSelection"
    persistent
  >
    <QCard style="width: 400px;">
      <QCardSection>
        <SelectDevices />
      </QCardSection>
      <QCardActions align="right">
        <QBtn
          v-close-popup
          flat
          label="Cancel"
          @click="disable()"
        />
        <QBtn
          label="Join"
          color="primary"
          @click="join"
        />
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup>
import { QCard, QCardSection, QCardActions, QDialog, QBtn } from 'quasar'
import { ref } from 'vue'

import { useMediaDeviceService, useRoomService } from '@/meet/helpers'

import Meeting from '@/meet/components/Meeting.vue'
import SelectDevices from '@/meet/components/SelectDevices.vue'

const { disable } = useMediaDeviceService()
const { joinRoom } = useRoomService()

const showDeviceSelection = ref(false)
const showMeeting = ref(false)

function join () {
  joinRoom('yay')
  showDeviceSelection.value = false
  showMeeting.value = true
}
</script>
