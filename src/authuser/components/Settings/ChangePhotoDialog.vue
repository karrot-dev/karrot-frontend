<template>
  <QDialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
  >
    <QCard class="q-dialog-plugin">
      <QCardSection>
        <div class="text-h6">
          {{ t('USERDATA.SET_PHOTO') }}
        </div>
      </QCardSection>
      <QCardSection class="flex-center flex">
        <QBtn
          v-if="!imageUrl"
          size="xl"
          class="q-pa-lg"
          flat
          no-caps
          @click="open"
        >
          <div class="column flex-center">
            <QIcon
              name="fas fa-file-image"
              size="xl"
            />
            {{ t('IMAGE_UPLOAD.SELECT') }}
          </div>
        </QBtn>
        <Cropper
          v-if="imageUrl"
          ref="cropperRef"
          :src="imageUrl"
          :stencil-props="{
            aspectRatio: 1,
          }"
          :default-size="defaultSize"
        />
      </QCardSection>
      <QCardActions align="right">
        <QBtn
          v-if="imageUrl"
          flat
          @click="open"
        >
          {{ t('IMAGE_UPLOAD.SELECT') }}
        </QBtn>
        <QBtn
          flat
          :disable="isSaving"
          @click="onDialogCancel"
        >
          {{ t('BUTTON.CANCEL') }}
        </QBtn>
        <QBtn
          flat
          :disable="!imageUrl"
          :loading="isSaving"
          @click="onOKClick"
        >
          {{ t('BUTTON.APPLY') }}
        </QBtn>
      </QCardActions>
    </QCard>
  </QDialog>
</template>

<script setup>
import { useFileDialog, useObjectUrl } from '@vueuse/core'
import { useDialogPluginComponent, QBtn, QCard, QCardActions, QCardSection, QDialog, QIcon } from 'quasar'
import { computed, ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import '@/css/vue-advanced-cropper.scss'
import { useI18n } from 'vue-i18n'

import { useSaveUserMutation } from '@/authuser/mutations'
import { showToast } from '@/utils/toasts'

const props = defineProps({
  file: {
    type: File,
    required: false,
  },
})

const { t } = useI18n()

const cropperRef = ref(null)

const { open, files } = useFileDialog({
  multiple: false,
  accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
})

function defaultSize ({ imageSize, visibleArea }) {
  return {
    width: (visibleArea || imageSize).width,
    height: (visibleArea || imageSize).height,
  }
}

defineEmits([
  ...useDialogPluginComponent.emits,
])

const {
  mutateAsync: saveUser,
} = useSaveUserMutation()

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

async function canvasToBlob (canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

const isSaving = ref(false)

async function onOKClick () {
  isSaving.value = true
  try {
    if (cropperRef.value) {
      const { canvas } = cropperRef.value.getResult()
      if (canvas) {
        const blob = await canvasToBlob(canvas, 'image/jpeg', 0.9)
        await saveUser({ photo: blob })
        showToast({
          message: 'NOTIFICATIONS.CHANGES_SAVED',
          config: {
            timeout: 2000,
            icon: 'thumb_up',
          },
        })
      }
    }
  }
  finally {
    isSaving.value = false
  }
  onDialogOK()
}

const image = computed(() => files.value?.[0] ?? props.file)

const imageUrl = useObjectUrl(image)
</script>
