<template>
  <div class="edit-box">

    <q-field
      icon="fa-star"
      :label="$t('USERDETAIL.PASSWORD')"
      :error="hasAnyError"
      :error-label="anyFirstError"
    >
      <q-input
        type="password"
        v-model="newPassword"
      />
    </q-field>
    <div class="actionButtons">
      <q-btn
        color="primary"
        @click="save"
        loader
        :value="isPending"
      >
        {{ $t('BUTTON.CHANGE_PASSWORD') }}
      </q-btn>
    </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QField, QInput, QBtn },
  mixins: [statusMixin],
  data () {
    return {
      oldPassword: '',
      newPassword: '',
    }
  },
  methods: {
    save () {
      const { oldPassword, newPassword } = this
      this.$emit('save', { oldPassword, newPassword })
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
