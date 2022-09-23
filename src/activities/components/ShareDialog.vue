<template>
  <QDialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <QCard class="q-dialog-plugin">
      <QCardSection class="q-dialog__title">
        <QIcon
          name="fas fa-share-alt"
          size="xs"
          class="q-mr-xs"
        />
        Public activity link
      </QCardSection>
      <QCardSection
        class="q-dialog__message"
      >
        <p>Copy the link and send it to the person you want to invite</p>
        <QField filled>
          <template #append>
            <QBtn
              flat
              rounded
              icon="fas fa-copy"
              @click="copyLink"
            >
              <QTooltip
                anchor="top middle"
                self="bottom middle"
              >
                {{ $t('URL_CLICK_TO_COPY') }}
              </QTooltip>
            </QBtn>
          </template>
          <template #control>
            <div
              class="self-center full-width no-outline"
              style="word-break: break-word; overflow-wrap: break-word;"
            >
              {{ linkToCopy }}
            </div>
          </template>
        </QField>
      </QCardSection>
      <QCardSection align="right">
        <QBtn
          flat
          color="primary"
          :label="$t('BUTTON.CLOSE')"
          @click="onDialogCancel"
        />
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<script setup>
import {
  useDialogPluginComponent,
  QCard,
  QCardSection,
  QBtn,
  QDialog,
  QField,
  QTooltip,
  QIcon,
  copyToClipboard,
} from 'quasar'

import { showToast } from '@/utils/toasts'

const props = defineProps({
  linkToCopy: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})

defineEmits(useDialogPluginComponent.emits)

const {
  dialogRef,
  onDialogHide,
  onDialogCancel,
} = useDialogPluginComponent()

async function copyLink () {
  await copyToClipboard(props.linkToCopy)
  showToast({
    message: 'URL_COPIED_TOAST',
  })
}

</script>
