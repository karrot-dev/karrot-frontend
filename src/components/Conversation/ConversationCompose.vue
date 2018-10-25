<template>
  <q-item multiline>
    <q-item-side v-if="!slim">
      <ProfilePicture
        :user="user"
        :size="40"
        style="margin-top: 36px"
      />
    </q-item-side>
    <q-item-main>
      <q-item-tile>
        <q-field
          :error="hasAnyError"
          :error-label="anyFirstError"
        >
          <component
            :is="slim ? 'div' : 'MarkdownInput'"
            :value="message"
          >
            <q-input
              ref="input"
              type="textarea"
              rows="1"
              :autofocus="autofocus"
              v-model="message"
              :placeholder="placeholder"
              :after="afterInput"
              :loading="isPending"
              :disable="isPending"
              @keyup.ctrl.enter="submit"
              @keyup.esc="leaveEdit"
              @focus="onFocus"
              @blur="onBlur"
            />
          </component>
        </q-field>
      </q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QItem, QItemMain, QInput, QField, QBtn, QItemSide, QItemTile } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import MarkdownInput from '@/components/MarkdownInput'

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
    autofocus: {
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
  computed: {
    afterInput () {
      let actions = [{ icon: 'fas fa-arrow-right', content: true, handler: this.submit }]
      if (this.value) {
        actions.push({ icon: 'fas fa-times', handler: this.leaveEdit })
      }
      return actions
    },
  },
}
</script>
