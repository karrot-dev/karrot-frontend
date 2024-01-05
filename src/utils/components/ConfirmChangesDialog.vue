<template>
  <QDialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <QCard class="q-dialog-plugin">
      <form @submit.prevent.stop="submit">
        <QCardSection class="q-dialog__title">
          {{ $t('HISTORY.CONFIRM_CHANGES') }}
        </QCardSection>
        <QCardSection class="q-dialog__message">
          {{ $t('HISTORY.CONFIRM_CHANGES_HINT') }}
          ({{ $t('VALIDATION.OPTIONAL') }})
        </QCardSection>
        <QCardSection
          v-if="extraComponent"
          class="q-dialog__message"
        >
          <component
            :is="extraComponent"
            v-bind="extraComponentProps"
            @extra-data="data => extraData = data"
          />
        </QCardSection>
        <QCardSection class="q-dialog__message">
          <QInput
            ref="updatedMessageRef"
            v-model="updatedMessage"
            autogrow
            outlined
            autofocus
            :placeholder="$t('WALL.WRITE_MESSAGE')"
            @keyup.ctrl.enter="submit"
          />
        </QCardSection>
        <QCardActions align="right">
          <QBtn
            flat
            color="primary"
            :label="$t('BUTTON.CANCEL')"
            @click="onDialogCancel"
          />
          <QBtn
            flat
            color="primary"
            type="submit"
            :label="$t('BUTTON.SAVE_CHANGES')"
            data-testid="confirmChanges"
          />
        </QCardActions>
      </form>
    </QCard>
  </QDialog>
</template>

<script setup>
import {
  useDialogPluginComponent,
  QCard,
  QInput,
  QCardSection,
  QBtn,
  QDialog,
  QCardActions,
} from 'quasar'
import { ref } from 'vue'

const updatedMessageRef = ref(null)
const updatedMessage = ref('')
const extraData = ref(null)

defineProps({
  extraComponent: {
    type: Object,
    default: null,
  },
  extraComponentProps: {
    type: Object,
    default: null,
  },
})

defineEmits(useDialogPluginComponent.emits)

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent()

function submit () {
  updatedMessageRef.value.validate()
  if (updatedMessageRef.value.hasError) return
  const data = {}
  if (updatedMessage.value) {
    Object.assign(data, { updatedMessage: updatedMessage.value })
  }
  if (extraData.value) {
    Object.assign(data, extraData.value)
  }
  onDialogOK(data)
}
</script>
