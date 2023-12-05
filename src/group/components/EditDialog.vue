<template>
  <QDialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
  >
    <QCard
      class="q-dialog-plugin full-width"
    >
      <component
        :is="form"
        v-bind="formProps"
        @ok="onDialogOK"
        @cancel="onDialogCancel"
      />
    </QCard>
  </QDialog>
</template>

<script setup>
import { useDialogPluginComponent, QCard, QDialog } from 'quasar'

defineProps({
  form: {
    type: Object,
    required: true,
  },
  formProps: {
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
