<template>
  <div
    class="q-pt-sm"
  >
    <QItem>
      <QItemSection
        v-if="!slim"
        side
        top
        class="q-pr-sm"
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
            v-bind="{ ...$attrs, ...contentError }"
            dense
            mentions
            :placeholder="placeholder"
            :loading="isPending"
            :disable="isPending"
            :input-style="{ minHeight: 'unset', maxHeight: '320px', ...$attrs['input-style'] }"
            @keyup.ctrl.enter="submit"
            @keyup.esc="leaveEdit"
            @focus="onFocus"
            @blur="onBlur"
          >
            <template #append>
              <QBtn
                round
                dense
                flat
                icon="fas fa-paperclip"
                :title="$t('ATTACHMENTS.ADD')"
                @click="addAttachment"
              />
              <QBtn
                v-if="hasContent && !isPending"
                round
                dense
                flat
                icon="fas fa-arrow-right"
                :title="$t('BUTTON.SEND_MESSAGE')"
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
        <Attachments
          ref="attachments"
          v-model="message.attachments"
          edit
        />
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
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import deepEqual from 'deep-equal'
import {
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
} from 'quasar'

import { deleteDraft, fetchDraft, saveDraft } from '@/messages/utils'
import statusMixin, { mapErrors } from '@/utils/mixins/statusMixin'

import Attachments from '@/messages/components/Attachments'
import ProfilePicture from '@/users/components/ProfilePicture'
import MarkdownInput from '@/utils/components/MarkdownInput'
import MultiCroppa from '@/utils/components/MultiCroppa'

export default {
  name: 'ConversationCompose',
  components: {
    QItem,
    QItemSection,
    QItemLabel,
    QBtn,
    ProfilePicture,
    MarkdownInput,
    MultiCroppa,
    Attachments,
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
  },
  emits: [
    'submit',
    'leave-edit',
  ],
  setup () {
    return {
      v$: useVuelidate(),
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
    ...mapErrors({
      content: [
        ['required', 'VALIDATION.REQUIRED'],
      ],
    }, 'message'),
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
      this.v$.message.$touch()
      if (this.v$.message.$error) return
      this.v$.message.$reset()
      this.$emit('submit', this.message)
    },
    addImage () {
      this.showImages = true
      this.$nextTick(() => {
        this.$refs.multiCroppa.open()
      })
    },
    addAttachment () {
      this.$refs.attachments.pickFiles()
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
  validations: {
    message: {
      content: {
        required,
      },
    },
  },
}
</script>
