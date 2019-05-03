<template>
  <QItem multiline>
    <QItemSide v-if="!slim">
      <ProfilePicture
        :user="user"
        :size="40"
        style="margin-top: 36px"
      />
    </QItemSide>
    <QItemMain>
      <QItemTile>
        <QField
          :error="hasAnyError"
          :error-label="anyFirstError"
        >
          <Component
            :is="slim ? 'div' : 'MarkdownInput'"
            :value="message"
          >
            <QInput
              ref="input"
              v-model="message"
              type="textarea"
              rows="1"
              :placeholder="placeholder"
              :after="afterInput"
              :loading="isPending"
              :disable="isPending"
              @keyup.ctrl.enter="submit"
              @keyup.esc="leaveEdit"
              @focus="onFocus"
              @blur="onBlur"
            />
          </Component>
        </QField>
      </QItemTile>
      <QItemTile
        v-if="!isParticipant"
        v-t="'CONVERSATION.NOT_PARTICIPATED'"
        sublabel
        class="q-mt-md q-caption"
      />
    </QItemMain>
  </QItem>
</template>

<script>
import ProfilePicture from '@/users/components/ProfilePicture'
import { QItem, QItemMain, QInput, QField, QBtn, QItemSide, QItemTile } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import MarkdownInput from '@/utils/components/MarkdownInput'

export default {
  name: 'ConversationCompose',
  components: { QItem, QField, QInput, QBtn, QItemMain, QItemSide, QItemTile, ProfilePicture, MarkdownInput },
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
  computed: {
    afterInput () {
      let actions = [{ icon: 'fas fa-arrow-right', content: true, handler: this.submit }]
      if (this.value) {
        actions.push({ icon: 'fas fa-times', handler: this.leaveEdit })
      }
      return actions
    },
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
