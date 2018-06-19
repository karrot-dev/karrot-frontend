<template>
  <q-item multiline>
    <q-item-side>
      <ProfilePicture
        :user="user"
        :size="40"
      />
    </q-item-side>
    <q-item-main>
      <q-item-tile>
        <q-field
          :error="hasAnyError"
          :error-label="anyFirstError"
        >
          <q-input
            type="textarea"
            rows="1"
            autofocus
            v-model="message"
            :placeholder="placeholder"
            :after="afterInput"
            :loading="isPending"
            :disable="isPending"
            @keyup.ctrl.enter="submit"
            @keyup.esc="leaveEdit"
          />
        </q-field>
      </q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QItem, QItemMain, QInput, QField, QBtn, QItemSide, QItemTile } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  name: 'ConversationCompose',
  components: { QItem, QField, QInput, QBtn, QItemMain, QItemSide, QItemTile, ProfilePicture },
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
  },
  data () {
    return {
      message: (this.value) || '',
    }
  },
  watch: {
    value (val) {
      if (val) this.message = val.content
    },
    isPending (val) {
      if (!val && !this.hasAnyError) this.message = ''
    },
  },
  methods: {
    submit () {
      this.$emit('submit', this.message)
    },
    leaveEdit () {
      this.$emit('leaveEdit')
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

<style scoped lang="stylus">
</style>
