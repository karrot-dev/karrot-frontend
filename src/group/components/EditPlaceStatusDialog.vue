<template>
  <QDialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
  >
    <QCard
      class="q-dialog-plugin full-width"
    >
      <PlaceStatusForm
        :place-status="placeStatus"
        @done="onDialogHide"
      />
    </QCard>
  </QDialog>
</template>

<script setup>
import { useDialogPluginComponent, QCard, QDialog } from 'quasar'

import PlaceStatusForm from '@/group/components/PlaceStatusForm.vue'

defineProps({
  placeStatus: {
    type: Object,
    required: true,
  },
})

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide } = useDialogPluginComponent()
</script>
