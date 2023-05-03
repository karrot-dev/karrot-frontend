<template>
  <div
    class="q-pt-sm"
  >
    <QItem>
      <QItemSection
        v-if="!slim"
        side
        top
        class="q-mt-xs q-pr-sm"
      >
        <ProfilePicture
          :user="user"
          :size="40"
        />
      </QItemSection>
      <QItemSection>
        <QItemLabel>
          <MarkdownInput
            ref="input"
            v-model="message.content"
            v-bind="$attrs"
            dense
            mentions
            :placeholder="placeholder"
            :loading="isPending"
            :disable="isPending"
            :error="hasAnyError"
            :error-message="anyFirstError"
            :input-style="{ minHeight: 'unset', maxHeight: '320px', ...$attrs['input-style'] }"
            @keyup.ctrl.enter="submit"
            @keyup.esc="leaveEdit"
            @focus="onFocus"
            @blur="onBlur"
          >
            <template #append>
              <QBtn
                v-if="false"
                round
                dense
                flat
                icon="fas fa-image"
                @click="addImage"
              />
              <QBtn
                round
                dense
                flat
                icon="fas fa-paperclip"
              >
                <QMenu>
                  <QList>
                    <QItem
                      clickable
                      @click="addImage"
                    >
                      <QItemSection
                        avatar
                        side
                      >
                        <QAvatar
                          color="primary"
                          text-color="white"
                          icon="fas fa-image"
                        />
                      </QItemSection>
                      <QItemSection>
                        Add image
                      </QItemSection>
                    </QItem>
                    <QItem
                      clickable
                      @click="addAttachment"
                    >
                      <QItemSection
                        avatar
                        side
                      >
                        <QAvatar
                          color="primary"
                          text-color="white"
                          icon="fas fa-file"
                        />
                      </QItemSection>
                      <QItemSection>
                        Add file
                      </QItemSection>
                    </QItem>
                  </QList>
                </QMenu>
              </QBtn>
              <QBtn
                v-if="hasContent && !isPending"
                round
                dense
                flat
                icon="fas fa-arrow-right"
                data-testid="send-message"
                @click="submit"
              />
              <QBtn
                v-if="hasExistingContent && !isPending"
                round
                dense
                flat
                icon="fas fa-times"
                @click="leaveEdit"
              />
            </template>
          </MarkdownInput>
        </QItemLabel>
        <QItemLabel
          v-if="!isParticipant"
          caption
          class="q-pt-md q-pl-xs"
        >
          <span v-t="'CONVERSATION.NOT_PARTICIPATED'" />
        </QItemLabel>
      </QItemSection>
    </QItem>
    <input
      ref="inputRef"
      type="file"
      style="display: none;"
      multiple
      capture="environment"
      @change="addFilesToQueue"
    >
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
            bordered
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
              <div class="text-subtitle1 ellipsis">{{ file.name }}</div>
              <div class="text-caption ellipsis">{{ file.__sizeLabel }}</div>
            </QCardSection>
          </QCard>
          <template v-if="false">
            <div
              v-for="file of files"
              :key="file.__key"
              style="border: 1px solid #ddd;"
              class="rounded-borders q-pa-xs"
            >
              <img
                v-if="file.__img"
                :src="file.__img.src"
                style="height: 100px; max-width: 150px; overflow: hidden; display: block; object-fit: cover;"
                class="rounded-borders"
              >
              <template v-else>
                <QIcon name="fas fa-paperclip" />
                <strong>{{ file.name }}</strong>
              </template>
            </div>
          </template>
        </div>
      </QItemSection>
    </QItem>
    <QItem v-if="showImages">
      <QItemSection
        v-if="!slim"
        side
        top
        class="q-mt-xs q-pr-sm"
        style="width: 40px;"
      />
      <QItemSection>
        <MultiCroppa
          ref="multiCroppa"
          v-model="message.images"
          :prevent-white-space="false"
          small
        />
      </QItemSection>
    </QItem>
  </div>
</template>

<script>
import deepEqual from 'deep-equal'
import {
  QItem,
  QItemSection,
  QList,
  QAvatar,
  QItemLabel,
  QBtn,
  QMenu,
  QIcon,
  QCard,
  QCardSection,
  QCardActions,
  QImg,
  format,
} from 'quasar'
import useFile, { useFileProps } from 'quasar/src/composables/private/use-file'
import { ref } from 'vue'

import { deleteDraft, fetchDraft, saveDraft } from '@/messages/utils'
import statusMixin from '@/utils/mixins/statusMixin'

import ProfilePicture from '@/users/components/ProfilePicture'
import MarkdownInput from '@/utils/components/MarkdownInput'
import MultiCroppa from '@/utils/components/MultiCroppa'

const { humanStorageSize } = format

export default {
  name: 'ConversationCompose',
  components: {
    QItem,
    QItemSection,
    QItemLabel,
    QList,
    QAvatar,
    QBtn,
    QMenu,
    QIcon,
    QCard,
    QCardSection,
    QCardActions,
    QImg,
    ProfilePicture,
    MarkdownInput,
    MultiCroppa,
  },
  mixins: [statusMixin],
  props: {
    placeholder: {
      type: String,
      default: '',
    },
    user: {
      type: Object,
      default: null,
    },
    value: {
      type: Object,
      default: null,
    },
    slim: {
      type: Boolean,
      default: false,
    },
    isParticipant: {
      type: Boolean,
      default: true,
    },
    // If provided will store message drafts persistently
    draftKey: {
      type: [String, Number],
      default: null,
    },
    ...useFileProps,
  },
  emits: [
    'submit',
    'leave-edit',
  ],
  setup () {
    const inputRef = ref(null)
    const files = ref([])

    const {
      pickFiles,
      processFiles,
    } = useFile({
      editable: ref(true),
      dnd: ref(false),
      addFilesToQueue,
      getFileInput () {
        console.log('getting file input!', inputRef.value)
        return inputRef.value
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
      // state.queuedFiles.value = state.queuedFiles.value.concat(localFiles)
    }

    return {
      inputRef,
      pickFiles,
      addFilesToQueue,
      files,
    }
  },
  data () {
    return {
      message: this.value
        ? { ...this.value }
        : {
            content: fetchDraft(this.draftKey, ''),
            images: [],
            attachments: [],
          },
      hasFocus: false,
      showImages: this.value && this.value.images.length > 0,
    }
  },
  computed: {
    hasExistingContent () {
      if (!this.value) return false
      return (
        this.value.content ||
        (this.value.images && this.value.images.filter(image => !image._removed).length > 0) ||
        (this.value.attachments && this.value.attachments.filter(attachment => !attachment._removed).length > 0)
      )
    },
    hasContent () {
      if (!this.message) return false
      return (
        this.message.content ||
        (this.message.images && this.message.images.filter(image => !image._removed).length > 0) ||
        (this.message.attachments && this.message.attachments.filter(attachment => !attachment._removed).length > 0)
      )
    },
  },
  watch: {
    draftKey (val) {
      this.message.content = fetchDraft(val, '')
    },
    value (val, previousVal) {
      if (val && !deepEqual(val, previousVal)) this.message = { ...val }
    },
    isPending (val) {
      if (!val && !this.hasAnyError) {
        // We have gone from pending -> not pending and there are no errors
        // Effectively means it was successful! So we can reset all the things.
        this.message = { content: '', images: [], attachments: [] }
        deleteDraft(this.draftKey)
      }
    },
    '$keyboard.is.open' (val) {
      // if mobile keyboard opens, try to keep q-input on screen
      if (!val || !this.hasFocus) return
      const input = this.$refs.input
      if (!input) return
      input.blur()
      input.focus()
    },
    'message.content' (content) {
      if (this.draftKey === null) return
      saveDraft(this.draftKey, content)
    },
    'message.images' (val) {
      // if the last image is removed, hide the image bar
      if (!val || val.length === 0) {
        this.showImages = false
      }
    },
  },
  methods: {
    submit () {
      this.$emit('submit', this.message)
    },
    addImage () {
      this.showImages = true
      this.$nextTick(() => {
        this.$refs.multiCroppa.open()
      })
    },
    addAttachment (event) {
      this.pickFiles()
    },
    leaveEdit () {
      this.$emit('leave-edit')
    },
    onFocus () {
      this.hasFocus = true
    },
    onBlur () {
      this.hasFocus = false
    },
  },
}
</script>

<style lang="sass">
.attachment--actions
  visibility: hidden
.attachment:hover
  .attachment--actions
    visibility: visible
</style>
