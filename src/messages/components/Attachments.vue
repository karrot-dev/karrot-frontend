<template>
  <QItem
    v-if="attachments.length > 0"
    class="q-pa-none"
  >
    <QItemSection
      v-if="props.edit && !slim"
      side
      top
      class="q-pr-sm"
      style="width: 40px;"
    />
    <QItemSection>
      <div class="row q-pb-sm">
        <QCard
          v-for="attachment of attachmentsToDisplay"
          :key="attachment._key"
          :bordered="!Boolean(attachment._img)"
          flat
          class="q-ma-xs attachment"
          style="height: 70px; max-width: 220px; overflow: hidden;"
        >
          <QCardActions
            v-if="props.edit && false"
            align="right"
            class="absolute-top z-top attachment--action q-pa-xs"
          >
            <QBtn
              icon="fas fa-times"
              flat
              round
              size="sm"
              color="red"
              class="bg-white"
              :title="$t('BUTTON.DELETE')"
              @click="removeAttachment(attachment)"
            />
          </QCardActions>
          <QCardActions
            v-if="!props.edit && false"
            align="right"
            class="absolute-bottom z-top attachment--action q-pa-xs"
          >
            <QBtn
              v-if="attachment.urls.download"
              icon="fas fa-download"
              flat
              round
              size="sm"
              color="white"
              text-color="primary"
              class="bg-white"
              :href="attachment.urls.download"
              :title="$t('BUTTON.DOWNLOAD')"
            />
          </QCardActions>

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
              :href="attachment.urls.download"
            >
              <img
                :src="attachment._img.src"
                class="rounded-borders image cursor-pointer"
                @click.stop.prevent="openGallery(attachment.id)"
              >
            </a>
          </template>
          <QCardSection
            v-else
            class="q-pa-sm"
            :title="attachment.filename"
          >
            <div class="text-subtitle1 ellipsis">
              {{ attachment.filename }}
            </div>
            <div class="text-caption ellipsis">
              {{ attachment._sizeLabel }}
            </div>
          </QCardSection>
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
  QCardSection,
  QCardActions,
  format,
} from 'quasar'
// naughty! using a "private" module... but it's useful!
import useFile, { useFileProps } from 'quasar/src/composables/private/use-file'
import { onMounted, onUnmounted, ref, computed } from 'vue'

import AttachmentGallery from '@/messages/components/AttachmentGallery.vue'

const { humanStorageSize } = format

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  slim: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  // Need to use these, as the useFile thing extracts props from
  // our "current instance" (i.e. the thing with these props)
  // TODO: now I'm not using processFiles() from use-file, check I still need to do this
  ...useFileProps,
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
function initializeInput () {
  if (input) return
  input = document.createElement('input')
  input.type = 'file'
  input.style.display = 'none'
  if (props.multiple) {
    input.multiple = true
  }
  if (props.capture) {
    input.capture = props.capture
  }
  input.addEventListener('change', addFilesToQueue)
  document.body.appendChild(input)
}

function removeInput () {
  if (input) {
    input.removeEventListener('change', addFilesToQueue)
    input.remove()
    input = null
  }
}

onMounted(() => {
  initializeInput()
})

onUnmounted(() => {
  removeInput()
})

defineExpose({
  pickFiles () {
    pickFiles()
  },
})

const { pickFiles } = useFile({
  editable: ref(true),
  dnd: ref(false),
  addFilesToQueue,
  getFileInput () {
    return input
  },
})

function addFilesToQueue (e, filesToProcess) {
  const fileList = Array.from(filesToProcess || e.target.files)
  let nextPosition = attachments.value.length > 0 ? Math.max(...attachments.value.map(attachment => attachment.position)) + 1 : 0
  attachments.value = attachments.value.concat(fileList.map((file, index) => withAttachmentMeta({
    _file: file,
    filename: file.name,
    contentType: file.type,
    toBlob () {
      return file
    },
    position: nextPosition++,
  })))
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
    _key: getKey(attachment),
    _sizeLabel: getSizeLabel(attachment),
    _img: getImage(attachment),
  }
}

function getSizeLabel (attachment) {
  if (attachment._sizeLabel) {
    return attachment._sizeLabel
  }
  else if (attachment.size) {
    return humanStorageSize(attachment.size)
  }
  else if (attachment._file) {
    return humanStorageSize(attachment._file.size)
  }
}

function getKey (attachment) {
  if (attachment._key) {
    return attachment._key
  }
  else if (attachment._file) {
    const file = attachment._file
    // borrowed from quasars use-file inside processFiles()
    return file.webkitRelativePath + file.lastModified + file.name + file.size
  }
  else {
    return attachment.id
  }
}

function getImage (attachment) {
  if (attachment._img) {
    return attachment._img
  }
  else if (attachment.contentType?.toUpperCase().startsWith('IMAGE')) {
    if (attachment._file) {
      const img = new Image()
      img.src = window.URL.createObjectURL(attachment._file)
      return img
    }
    else if (attachment.urls) {
      const img = new Image()
      img.src = attachment.urls.preview
      return img
    }
  }
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
.image
  height: 70px
  min-width: 100px
  max-width: 220px
  overflow: hidden
  object-fit: cover
</style>

<style lang="sass">
.attachment--action
  visibility: hidden

.attachment:hover
  .attachment--action
    visibility: visible
</style>
