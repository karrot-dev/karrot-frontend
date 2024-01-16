<template>
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
</template>
<script setup>
import { QSelect, QIcon } from 'quasar'

import { useAudioMediaStreamVolume, useMediaDeviceService } from '@/meet/helpers'

const {
  audioEnabled,
  audioDevices,
  audioDeviceId,
  audioLoading,
  audioMediaStream,
} = useMediaDeviceService()

const {
  audioVolume,
  audioIsSilent,
} = useAudioMediaStreamVolume(audioMediaStream)

</script>
