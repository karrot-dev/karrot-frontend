<template>
  <QItem
    v-if="attachments.length > 0"
    class="q-pa-none"
  >
    <QItemSection>
      <div class="row q-pb-sm">
        <QCard
          v-for="attachment of attachmentsToDisplay"
          :key="attachment._key"
          :bordered="!Boolean(attachment._img)"
          flat
          class="q-ma-xs attachment"
          :tag="props.edit ? 'div' : 'a'"
          :href="!props.edit && attachment.urls.original"
          :target="!props.edit && '_blank'"
          :title="attachment.filename"
        >
          <QBtn
            v-if="props.edit"
            icon="fas fa-times"
            flat
            round
            size="sm"
            color="red"
            class="bg-white z-top absolute-top-right attachment--action q-ma-xs"
            :title="$t('BUTTON.DELETE')"
            @click="removeAttachment(attachment)"
          />

          <QBtn
            v-if="!props.edit && attachment.urls.download"
            icon="fas fa-download"
            flat
            round
            size="sm"
            color="white"
            text-color="primary"
            class="bg-white z-top absolute-bottom-right attachment--action q-ma-xs"
            :href="attachment.urls.download"
            :title="$t('BUTTON.DOWNLOAD')"
          />

          <template
            v-if="attachment._img"
          >
            <img
              v-if="props.edit"
              :src="attachment._img.src"
              class="rounded-borders image"
            >
            <a
              v-else
              :href="attachment.urls.original"
            >
              <img
                :src="attachment._img.src"
                class="rounded-borders image cursor-pointer"
                @click.stop.prevent="openGallery(attachment.id)"
              >
            </a>
          </template>
          <template v-else>
            <QItem
              class="q-pa-sm"
            >
              <QItemSection
                v-if="attachment._contentTypeInfo.icon"
                avatar
                class="q-pr-sm"
                style="min-width: auto;"
              >
                <QIcon
                  :name="attachment._contentTypeInfo.icon"
                  size="md"
                  color="grey"
                />
              </QItemSection>
              <QItemSection>
                <div class="text-subtitle1 ellipsis">
                  {{ attachment.filename }}
                </div>
                <div class="text-caption ellipsis">
                  <span v-if="attachment._contentTypeInfo.name">
                    {{ attachment._contentTypeInfo.name }}
                  </span>
                  {{ attachment._sizeLabel }}
                </div>
              </QItemSection>
            </QItem>
          </template>
        </QCard>
      </div>
    </QItemSection>
    <AttachmentGallery
      v-if="galleryOpenId"
      :attachments="attachments"
      :selected-attachment-id="galleryOpenId"
      @close="galleryOpenId = null"
    />
  </QItem>
</template>

<script setup>
import {
  QItem,
  QItemSection,
  QBtn,
  QCard,
  QIcon,
  format,
} from 'quasar'
import { onUnmounted, ref, computed } from 'vue'

import { showToast } from '@/utils/toasts'
import { isViewableImageContentType } from '@/utils/utils'

import AttachmentGallery from '@/messages/components/AttachmentGallery.vue'

const { humanStorageSize } = format

const MAX_ATTACHMENT_COUNT = 6
const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  edit: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const attachments = computed({
  get () {
    return props.modelValue.map(withAttachmentMeta)
  },
  set (value) {
    emit('update:modelValue', value)
  },
})

const galleryOpenId = ref(null)

function sortByPosition (a, b) {
  return a.position - b.position
}

const attachmentsToDisplay = computed(() => {
  return attachments.value.filter(attachment => !attachment._removed).sort(sortByPosition)
})

let input

/**
 * It needs an <input> to hook into
 * We just create one programmatically and stick it
 * to the body element and remove it after
 */
function getFileInput () {
  if (input) return input
  input = document.createElement('input')
  input.dataset.testid = 'attachment-input'
  Object.assign(input, {
    type: 'file',
    style: {
      display: 'none',
    },
    multiple: true,
    capture: 'environment',
  })
  input.addEventListener('change', addFilesToQueue)
  document.body.appendChild(input)
  return input
}

function removeInput () {
  if (input) {
    input.removeEventListener('change', addFilesToQueue)
    input.remove()
    input = null
  }
}

onUnmounted(() => {
  removeInput()
})

defineExpose({
  pickFiles () {
    if (attachments.value.filter(attachment => !attachment._removed).length < MAX_ATTACHMENT_COUNT) {
      getFileInput().click()
    }
    else {
      showMaxAttachmentCountReachedToast()
    }
  },
})

function showMaxAttachmentCountReachedToast () {
  showToast({
    message: 'ATTACHMENTS.MAX_ATTACHMENT_COUNT',
    messageParams: {
      count: MAX_ATTACHMENT_COUNT,
    },
    config: {
      icon: 'priority_high',
      color: 'warning',
    },
  })
}

function showMaxAttachmentSizeReachedToast () {
  showToast({
    message: 'ATTACHMENTS.MAX_ATTACHMENT_SIZE',
    messageParams: {
      size: humanStorageSize(MAX_ATTACHMENT_SIZE),
    },
    config: {
      icon: 'priority_high',
      color: 'warning',
    },
  })
}

function addFilesToQueue (event) {
  const inputFiles = Array.from(event.target.files)

  const acceptedFiles = []
  let EXCEEDED_MAX_ATTACHMENT_SIZE = false

  for (const file of inputFiles) {
    if (file.size > MAX_ATTACHMENT_SIZE) {
      EXCEEDED_MAX_ATTACHMENT_SIZE = true
    }
    else {
      acceptedFiles.push(file)
    }
  }

  // Next position is the biggest one in the existing list + 1, or 0 if no items
  let nextPosition = attachments.value.length > 0 ? Math.max(...attachments.value.map(attachment => attachment.position)) + 1 : 0

  const attachmentsNext = attachments.value.concat(acceptedFiles.map(file => withAttachmentMeta({
    _file: file,
    filename: file.name,
    contentType: file.type || 'application/octet-stream',
    position: nextPosition++,
  })))
  const EXCEEDED_MAX_ATTACHMENT_COUNT = attachmentsNext.filter(attachment => !attachment._removed).length > MAX_ATTACHMENT_COUNT
  if (EXCEEDED_MAX_ATTACHMENT_SIZE) {
    showMaxAttachmentSizeReachedToast()
  }
  if (EXCEEDED_MAX_ATTACHMENT_COUNT) {
    showMaxAttachmentCountReachedToast()
  }
  attachments.value = attachmentsNext.slice(0, MAX_ATTACHMENT_COUNT)
}

/**
 * Returns a new attachment object with all the extra bits of info we use for
 * display. Handles both existing attachments from server and new ones we haven't saved yet.
 *
 * New ones have a _file on them.
 */
function withAttachmentMeta (attachment) {
  // just add the useful things on if they are not already there
  return {
    ...attachment,
    _new: !attachment.id,
    _key: attachment._key ?? getKey(attachment),
    _sizeLabel: attachment._sizeLabel ?? getSizeLabel(attachment),
    _img: attachment._img ?? getImage(attachment),
    _contentTypeInfo: attachment._contentTypeInfo ?? getContentTypeInfo(attachment),
  }
}

function getSizeLabel (attachment) {
  if (attachment._file) {
    return humanStorageSize(attachment._file.size)
  }
  else if (attachment.size) {
    return humanStorageSize(attachment.size)
  }
}

function getKey (attachment) {
  if (attachment._file) {
    const file = attachment._file
    // borrowed from quasars use-file inside processFiles()
    return file.webkitRelativePath + file.lastModified + file.name + file.size
  }
  return attachment.id
}

function getImage (attachment) {
  if (attachment._file) {
    // This means it's a new one we're about to upload
    // If it's something we would later view, then show it!
    if (isViewableImageContentType(attachment.contentType)) {
      return fileToImage(attachment._file)
    }
    // If *could* be a type that we would later render as a preview
    // ... but we can't create that preview on the client, so no img to show...
  }
  else if (attachment.urls) {
    const { preview, original } = attachment.urls
    if (preview) {
      // We have a preview, show it!
      return urlToImage(preview)
    }
    else if (original && isViewableImageContentType(attachment.contentType)) {
      // We don't have a preview, but the original is a viewable type, so just show that
      // This would be used for formats we don't support previews for on the backend, e.g. svg
      return urlToImage(original)
    }
  }
}

function fileToImage (file) {
  const img = new Image()
  img.src = window.URL.createObjectURL(file)
  return img
}

function urlToImage (url) {
  const img = new Image()
  img.src = url
  return img
}

function getContentTypeInfo (attachment) {
  const contentType = attachment.contentType.toLowerCase()
  switch (contentType) {
    case 'application/pdf': return {
      name: 'PDF',
      icon: 'fas fa-file-pdf',
    }
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    case 'application/msword':
      return {
        name: 'MS Word',
        icon: 'fas fa-file-word',
      }
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return {
        name: 'MS Excel',
        icon: 'fas fa-file-excel',
      }
    case 'text/calendar':
      return {
        name: 'iCal',
      }
    case 'application/vnd.apple.keynote':
      return {
        name: 'Apple Keynote',
        icon: 'fas fa-file',
      }
    case 'application/vnd.apple.pages':
      return {
        name: 'Apple Pages',
        icon: 'fas fa-file',
      }
    case 'application/zip':
      return {
        name: 'ZIP',
        icon: 'fas fa-file-archive',
      }
    case 'application/gzip':
      return {
        name: 'GZIP',
        icon: 'fas fa-file-archive',
      }
    case 'text/markdown':
      return {
        name: 'Markdown',
        icon: 'fas fa-file-code',
      }
    case 'application/json':
      return {
        name: 'JSON',
        icon: 'fas fa-file-code',
      }
    case 'text/plain':
      return {
        name: 'Text',
        icon: 'fas fa-file-alt',
      }
  }
  if (contentType.startsWith('image/')) {
    return {
      name: 'Image',
      icon: 'fas fa-file-image',
    }
  }
  if (contentType.startsWith('video/')) {
    return {
      name: 'Video',
      icon: 'fas fa-file-video',
    }
  }
  else if (contentType.startsWith('audio/')) {
    return {
      name: 'Audio',
      icon: 'fas fa-file-audio',
    }
  }
  return {}
}

function removeAttachment (attachmentToRemove) {
  if (attachmentToRemove._new) {
    // New attachment, not already on the server, so can just remove it from the array
    attachments.value = attachments.value.filter(attachment => attachment._key !== attachmentToRemove._key)
  }
  else {
    // we need to remove it from the server, so mark it as removed
    attachments.value = attachments.value.map(attachment => {
      if (attachment._key === attachmentToRemove._key) {
        return {
          ...attachment,
          _removed: true,
        }
      }
      return attachment
    })
  }
}

function openGallery (selectedAttachmentId) {
  galleryOpenId.value = selectedAttachmentId
}

</script>

<style scoped lang="sass">
.image,
.attachment
  height: 70px
  min-width: 100px
  max-width: 260px
  overflow: hidden

.image
  object-fit: cover
</style>

<style lang="sass">
.attachment--action
  visibility: hidden

.attachment:hover
  .attachment--action
    visibility: visible
</style>
