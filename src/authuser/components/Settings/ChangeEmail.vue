<template>
  <div
    id="change-email"
    class="edit-box"
  >
    <VerificationWarning />
    <QInput
      v-model="newEmail"
      type="email"
      :label="$t('USERDATA.EMAIL')"
      :error="hasError('newEmail')"
      :error-message="firstError('newEmail')"
    >
      <template #before>
        <QIcon name="fas fa-envelope" />
      </template>
    </QInput>
    <QInput
      v-model="password"
      type="password"
      :label="$t('USERDATA.CONFIRM_PASSWORD')"
      :error="hasError('password')"
      :error-message="firstError('password')"
    >
      <template #before>
        <QIcon name="fas fa-unlock" />
      </template>
    </QInput>
    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>
    <div class="row justify-end q-gutter-sm q-mt-sm">
      <QBtn
        color="primary"
        :disable="!hasEmailChanged || !hasPassword"
        :loading="isPending"
        @click="save"
      >
        {{ $t('BUTTON.CHANGE_EMAIL') }}
      </QBtn>
    </div>
  </div>
</template>

<script>
import {
  QInput,
  QBtn,
  QIcon,
} from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import VerificationWarning from '@/authuser/components/Settings/VerificationWarning'

export default {
  components: {
    QInput,
    QBtn,
    QIcon,
    VerificationWarning,
  },
  mixins: [statusMixin],
  props: {
    user: { required: true, type: Object },
  },
  data () {
    return {
      newEmail: '',
      password: '',
    }
  },
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
  watch: {
    user () {
      this.setEmail()
    },
  },
  mounted () {
    this.setEmail()
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
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
