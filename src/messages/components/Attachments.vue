<template>
  <QItem v-if="files.length > 0">
    <QItemSection
      v-if="!slim"
      side
      top
      class="q-pr-sm"
      style="width: 40px;"
    />
    <QItemSection>
      <div class="row q-pb-sm">
        <QCard
          v-for="file of files"
          :key="file.__key"
          :bordered="!Boolean(file.__img)"
          flat
          class="q-ma-xs attachment"
          style="height: 70px; max-width: 220px; overflow: hidden;"
        >
          <QCardActions
            align="right"
            class="absolute-top z-top attachment--actions q-pa-xs"
          >
            <QBtn
              icon="fas fa-times"
              flat
              rounded
              size="sm"
              color="red"
            />
          </QCardActions>
          <img
            v-if="file.__img"
            :src="file.__img.src"
            class="rounded-borders"
            style="height: 70px; min-width: 100px; max-width: 220px; overflow: hidden; object-fit: cover;"
          >
          <QCardSection
            v-else
            class="q-pa-sm"
            :title="file.name"
          >
            <div class="text-subtitle1 ellipsis">
              {{ file.name }}
            </div>
            <div class="text-caption ellipsis">
              {{ file.__sizeLabel }}
            </div>
          </QCardSection>
        </QCard>
      </div>
    </QItemSection>
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
  // Need to use these, as the useFile thing extracts props from
  // our "current instance" (i.e. the thing with these props)
  ...useFileProps,
})

const emit = defineEmits([
  'update:modelValue',
])

const files = ref([])

const attachments = computed({
  get () {
    return props.modelValue
  },
  set (value) {
    emit('update:modelValue', value)
  },
})

let input

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
  console.log('appended input', input)
}

onMounted(() => {
  initializeInput()
})

onUnmounted(() => {
  if (input) {
    input.removeEventListener('change', addFilesToQueue)
    input.remove()
    input = null
  }
})

defineExpose({
  pickFiles () {
    pickFiles()
  },
})

const {
  pickFiles,
  processFiles,
} = useFile({
  editable: ref(true),
  dnd: ref(false),
  addFilesToQueue,
  getFileInput () {
    return input
  },
})

function addFilesToQueue (e, fileList) {
  console.log('adding files!', e, fileList)
  const localFiles = processFiles(e, fileList, files.value, true)
  console.log('  localFiles', localFiles)

  for (const file of localFiles) {
    // state.updateFileStatus(file, 'idle')
    // uploadSize.value += file.size

    if (file.type.toUpperCase().startsWith('IMAGE')) {
      const img = new Image()
      img.src = window.URL.createObjectURL(file)
      file.__img = img
    }

    file.__sizeLabel = humanStorageSize(file.size)
  }

  files.value = files.value.concat(localFiles)

  attachments.value = attachments.value.concat(localFiles.map((file, index) => ({
    _new: true,
    filename: file.name,
    toBlob () {
      return file
    },
    position: index, // TODO: not true always...!
  })))
}
</script>
