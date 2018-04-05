<template>
  <div class="edit-box">
    <VerificationWarning v-if="user && !user.mailVerified" />

    <q-field
      icon="fa-envelope"
      :label="$t('USERDATA.EMAIL')"
      :error="hasError('newEmail')"
      :error-label="firstError('newEmail')"
    >
      <q-input
        type="email"
        v-model="newEmail"
      />
    </q-field>
    <q-field
      icon="fa-unlock"
      :label="$t('USERDATA.CONFIRM_PASSWORD')"
      :error="hasError('password')"
      :error-label="firstError('password')"
    >
      <q-input
        type="password"
        v-model="password"
      />
    </q-field>
    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>
    <div class="actionButtons">
      <q-btn
        color="primary"
        @click="save"
        :disable="!hasEmailChanged || !hasPassword"
        :loading="isPending"
        :value="isPending"
      >
        {{ $t('BUTTON.CHANGE_EMAIL') }}
      </q-btn>
    </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/mixins/statusMixin'
import VerificationWarning from '@/components/Settings/VerificationWarning'

export default {
  components: { QField, QInput, QBtn, VerificationWarning },
  mixins: [statusMixin],
  computed: {
    hasEmailChanged () {
      const previousEmail = this.user.email
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
      if (this.user) {
        this.newEmail = this.user.email || this.user.unverifiedEmail
      }
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
