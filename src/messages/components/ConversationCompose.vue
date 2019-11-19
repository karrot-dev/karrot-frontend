<template>
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
          v-model="message"
          dense
          :placeholder="placeholder"
          :loading="isPending"
          :disable="isPending"
          :error="hasAnyError"
          :error-message="anyFirstError"
          input-style="min-height: unset"
          @keyup.ctrl.enter="submit"
          @keyup.esc="leaveEdit"
          @focus="onFocus"
          @blur="onBlur"
        >
          <template v-slot:append>
            <QBtn
              v-if="message && !isPending"
              round
              dense
              flat
              icon="fas fa-arrow-right"
              @click="submit"
            />
            <QBtn
              v-if="value && !isPending"
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
        v-t="'CONVERSATION.NOT_PARTICIPATED'"
        caption
        class="q-pt-md q-pl-xs"
      />
    </QItemSection>
  </QItem>
</template>

<script>
import {
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
} from 'quasar'
import ProfilePicture from '@/users/components/ProfilePicture'
import MarkdownInput from '@/utils/components/MarkdownInput'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  name: 'ConversationCompose',
  components: {
    QItem,
    QItemSection,
    QItemLabel,
    QBtn,
    ProfilePicture,
    MarkdownInput,
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
      type: String,
      default: null,
    },
    conversation: {
      type: Number,
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
      message: (this.value) || localStorage[this.conversation] || '',
      hasFocus: false,
      key: this.conversation,
    }
  },
  watch: {
    value (val) {
      if (val) {
        this.message = val.content
      }
    },
    message (val) {
      if (val) {
        localStorage.setItem(this.getKey(), val)
      }
    },
    isPending (val) {
      if (!val && !this.hasAnyError) this.message = ''
    },
    '$keyboard.is.open' (val) {
      // if mobile keyboard opens, try to keep q-input on screen
      if (!val || !this.hasFocus) return
      const input = this.$refs.input
      if (!input) return
      input.blur()
      input.focus()
    },
  },
  methods: {
    getKey () {
      if (this.key) return this.key
      else return 'wallConv'
    },
    submit () {
      this.$emit('submit', this.message)
      localStorage.removeItem(this.getKey())
    },
    leaveEdit () {
      this.$emit('leaveEdit')
      this.message = ''
      localStorage.removeItem(this.getkey())
    },
    onFocus (event) {
      this.hasFocus = true
    },
    onBlur () {
      this.hasFocus = false
      this.message = ''
      localStorage.removeItem(this.getKey())
    },
  },
}
</script>
