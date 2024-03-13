<template>
  <QDialog
    ref="dialogRef"
    persistent
    :maximized="Platform.is.mobile"
    @hide="onDialogHide"
  >
    <QCard
      class="q-dialog-plugin full-width"
    >
      <component
        :is="component"
        v-bind="componentProps"
        @ok="onDialogOK"
        @cancel="onDialogCancel"
        @hide="onDialogHide"
      />
    </QCard>
  </QDialog>
</template>

<script setup>
import { useDialogPluginComponent, QCard, QDialog, Platform } from 'quasar'

defineProps({
  component: {
    type: Object,
    required: true,
  },
  componentProps: {
    type: Object,
    required: true,
  },
})

defineEmits([
  ...useDialogPluginComponent.emits,
])

const {
  dialogRef,
  onDialogOK,
  onDialogCancel,
  onDialogHide,
} = useDialogPluginComponent()
</script>
