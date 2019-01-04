<template>
  <div
    class="edit-box"
    id="change-email"
  >
    <VerificationWarning />

    <QField
      icon="fas fa-envelope"
      :label="$t('USERDATA.EMAIL')"
      :error="hasError('newEmail')"
      :error-label="firstError('newEmail')"
    >
      <QInput
        type="email"
        v-model="newEmail"
      />
    </QField>
    <QField
      icon="fas fa-unlock"
      :label="$t('USERDATA.CONFIRM_PASSWORD')"
      :error="hasError('password')"
      :error-label="firstError('password')"
    >
      <QInput
        type="password"
        v-model="password"
      />
    </QField>
    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>
    <div class="actionButtons">
      <QBtn
        color="primary"
        @click="save"
        :disable="!hasEmailChanged || !hasPassword"
        :loading="isPending"
      >
        {{ $t('BUTTON.CHANGE_EMAIL') }}
      </QBtn>
    </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import VerificationWarning from '@/authuser/components/Settings/VerificationWarning'

export default {
  components: { QField, QInput, QBtn, VerificationWarning },
  mixins: [statusMixin],
  computed: {
    hasEmailChanged () {
      if (!this.user) return
      const previousEmail = this.user.unverifiedEmail || this.user.email
      return this.newEmail && (previousEmail !== this.newEmail)
    },
    hasPassword () {
      return !!this.password
    },
  },
  props: {
    user: { required: true, type: Object },
  },
  data () {
    return {
      newEmail: '',
      password: '',
    }
  },
  methods: {
    reset () {
      this.setEmail()
      this.password = ''
    },
    save () {
      const { newEmail, password } = this
      this.$emit('save', { newEmail, password, done: this.reset })
    },
    setEmail () {
      if (!this.user) return
      this.newEmail = this.user.email || this.user.unverifiedEmail
    },
  },
  watch: {
    user () {
      this.setEmail()
    },
  },
  mounted () {
    this.setEmail()
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
