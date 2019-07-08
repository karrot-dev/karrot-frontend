<template>
  <QItem>
    <QItemSection
      v-if="!slim"
      avatar
    >
      <ProfilePicture
        :user="user"
        :size="40"
        style="margin-top: 36px"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel>
        <Component
          :is="slim ? 'div' : 'MarkdownInput'"
          :value="message"
        >
          <QInput
            ref="input"
            v-model="message"
            type="textarea"
            autogrow
            :placeholder="placeholder"
            :loading="isPending"
            :disable="isPending"
            :error="hasAnyError"
            :error-message="anyFirstError"
            @keyup.ctrl.enter="submit"
            @keyup.esc="leaveEdit"
            @focus="onFocus"
            @blur="onBlur"
          >
            <template v-slot:append>
              <QBtn
                v-if="message"
                round
                dense
                flat
                icon="fas fa-arrow-right"
                @click="submit"
              />
              <QBtn
                v-if="value"
                round
                dense
                flat
                icon="fas fa-times"
                @click="leaveEdit"
              />
            </template>
          </QInput>
        </Component>
      </QItemLabel>
      <QItemLabel
        v-if="!isParticipant"
        v-t="'CONVERSATION.NOT_PARTICIPATED'"
        caption
        class="q-mt-md text-caption"
      />
    </QItemSection>
  </QItem>
</template>

<script>
import {
  QItem,
  QItemSection,
  QItemLabel,
  QInput,
  QField,
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
    QInput,
    QField,
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
      message: (this.value) || '',
      hasFocus: false,
    }
  },
  watch: {
    value (val) {
      if (val) this.message = val.content
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
    submit () {
      this.$emit('submit', this.message)
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
