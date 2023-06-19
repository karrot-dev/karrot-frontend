<template>
  <QDialog
    ref="dialogRef"
    position="bottom"
    persistent
    seamless
    @hide="onDialogHide"
  >
    <QCard
      class="q-dialog-plugin"
      style="width: 300px; margin-bottom: 0;"
      square
    >
      <QLinearProgress
        v-if="progress"
        :value="progress.progress"
        color="pink"
      />
      <QCardSection v-if="progress">
        Uploading {{ humanStorageSize(progress.loaded) }} / {{ humanStorageSize(progress.total) }}
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script setup>
import {
  QDialog,
  QCard,
  QCardSection,
  QLinearProgress,
  useDialogPluginComponent,
  format,
} from 'quasar'

const { humanStorageSize } = format

defineProps({
  progress: {
    type: Object, // the progress object axios gives us, which I think is just the native browser progress event
    default: () => {},
  },
})

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide } = useDialogPluginComponent()
</script>
