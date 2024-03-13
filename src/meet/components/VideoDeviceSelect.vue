<template>
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
</template>
<script setup>
import { QSelect, QIcon } from 'quasar'

import { useMediaDeviceService } from '@/meet/helpers'

const {
  videoEnabled,
  videoDevices,
  videoDeviceId,
  videoLoading,
} = useMediaDeviceService()

</script>
