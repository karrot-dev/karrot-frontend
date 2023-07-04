<template>
  <QDialog
    ref="dialogRef"
    persistent
    @hide="onDialogHide"
  >
    <QCard class="q-dialog-plugin">
      <QCardSection v-if="title">
        <div class="text-h6">
          {{ title }}
        </div>
      </QCardSection>
      <QCardSection class="flex-center flex">
        <Cropper
          v-if="imageUrl"
          ref="cropperRef"
          :src="imageUrl"
          :stencil-props="{
            aspectRatio,
          }"
          :default-size="defaultSize"
        />
        <QBtn
          v-else
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

import { imageUploadAccept } from '@/utils/utils'

const props = defineProps({
  // Optionally can pass an initial file in
  file: {
    type: File,
    default: null,
  },
  title: {
    type: String,
    default: null,
  },
  aspectRatio: {
    type: Number,
    default: undefined,
  },
  outputFormat: {
    type: String,
    default: null,
  },
  // A function prop rather than an emit
  // so we can await the result and keep the dialog open
  // until the action has completed
  onChooseImage: {
    type: Function,
    default: () => {},
  },
})

const { t } = useI18n()

const cropperRef = ref(null)

const { open, files } = useFileDialog({
  multiple: false,
  accept: imageUploadAccept,
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

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

async function canvasToBlob (canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}

const isSaving = ref(false)

async function onOKClick () {
  try {
    isSaving.value = true
    if (cropperRef.value) {
      const { canvas } = cropperRef.value.getResult()
      if (canvas) {
        // By default keep output format same as original file
        const outputFormat = props.outputFormat ?? image.value.type ?? 'image/jpeg'
        const imageBlob = await canvasToBlob(canvas, outputFormat, 0.9)
        await props.onChooseImage?.({ image: imageBlob })
      }
    }
  }
  finally {
    isSaving.value = false
    onDialogOK()
  }
}

const image = computed(() => files.value?.[0] ?? props.file)

const imageUrl = useObjectUrl(image)
</script>
