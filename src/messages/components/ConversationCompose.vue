<template>
  <div>
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
            :placeholder="placeholder"
            :loading="isPending"
            :disable="isPending"
            :error="hasAnyError"
            :error-message="anyFirstError"
            input-style="min-height: unset; max-height: 320px;"
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
                icon="fas fa-image"
                @click="addImage"
              />
              <QBtn
                v-if="hasContent && !isPending"
                round
                dense
                flat
                icon="fas fa-arrow-right"
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
import {
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
} from 'quasar'
import deepEqual from 'deep-equal'
import ProfilePicture from '@/users/components/ProfilePicture'
import MarkdownInput from '@/utils/components/MarkdownInput'
import statusMixin from '@/utils/mixins/statusMixin'
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
  },
  data () {
    return {
      message: this.value ? { ...this.value } : {
        content: '',
        images: [],
      },
      hasFocus: false,
      showImages: this.value && this.value.images.length > 0,
    }
  },
  computed: {
    hasExistingContent () {
      if (!this.value) return false
      return this.value.content || (this.value.images && this.value.images.filter(image => !image._removed).length > 0)
    },
    hasContent () {
      if (!this.message) return false
      return this.message.content || (this.message.images && this.message.images.filter(image => !image._removed).length > 0)
    },
  },
  watch: {
    value (val, previousVal) {
      if (val && !deepEqual(val, previousVal)) this.message = { ...val }
    },
    isPending (val) {
      if (!val && !this.hasAnyError) this.message = { content: '', images: [] }
    },
    '$keyboard.is.open' (val) {
      // if mobile keyboard opens, try to keep q-input on screen
      if (!val || !this.hasFocus) return
      const input = this.$refs.input
      if (!input) return
      input.blur()
      input.focus()
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
    leaveEdit () {
      this.$emit('leaveEdit')
    },
    onFocus (event) {
      this.hasFocus = true
    },
    onBlur () {
      this.hasFocus = false
    },
  },
}
</script>
