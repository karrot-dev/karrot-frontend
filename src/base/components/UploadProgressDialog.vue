<template>
  <QDialog
    ref="dialogRef"
    position="bottom"
    persistent
    seamless
    @hide="onDialogHide"
  >
    <QCard
      v-if="progress"
      class="q-dialog-plugin bg-orange-1"
      style="width: 300px; margin-bottom: 0;"
      square
    >
      <QLinearProgress
        :value="progress.progress"
        color="orange"
      />
      <QCardSection
        class="row"
      >
        <div class="col text-subtitle2">
          {{ progress.progress < 1 ? t('GLOBAL.UPLOADING') : t('GLOBAL.PROCESSING') }}
        </div>
        <QSpace />
        <div class="col text-right text-caption">
          {{ humanStorageSize(progress.loaded) }} / {{ humanStorageSize(progress.total) }}
        </div>
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
  format, QSpace,
} from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
