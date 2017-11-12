<template>
  <div class="generic-padding bg-white">
    <h5 class="text-primary generic-padding">
      <q-icon name="fa-user-plus" />
      {{ $t('GROUP.INVITE_TITLE') }}
    </h5>
    <div>
      <form @submit.prevent="submit">
        <q-field
          icon="fa-envelope"
          :helper="$t('GROUP.INVITE_EMAIL')"
          :error="$v.form.email.$error"
          :error-label="emailErrorMessage"
        >
          <q-input
            v-model="form.email"
            type="email"
            autocorrect="off" autocapitalize="off" spellcheck="false"
            @keyup.enter="submit"
            @blur="$v.form.email.$touch"
          />
        </q-field>

        <div class="text-negative">{{ requestError('nonFieldErrors') }}</div>

        <q-btn type="submit" loader :value="sendStatus.isWaiting" :disabled="$v.form.$error">
          <q-icon name="fa-paper-plane" />
          <q-tooltip>
            {{ $t('GROUP.INVITE_SEND') }}
          </q-tooltip>
        </q-btn>
      </form>
    </div>

    <h5 class="text-primary generic-padding" v-if="invitations.length > 0">
      {{ $t('GROUP.INVITED_LIST') }}
    </h5>
    <ul>
      <li v-for="invite in invitations" :key="invite.id">{{ invite.email }}</li>
    </ul>
    <pre>{{ listStatus.error }}</pre>
  </div>
</template>

<script>
import { QIcon, QField, QInput, QBtn, QTooltip } from 'quasar'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  components: { QIcon, QField, QInput, QBtn, QTooltip },
  props: {
    invitations: { required: true },
    listStatus: { required: true },
    sendStatus: { required: true },
    requestError: { required: true },
  },
  data () {
    return {
      form: {
        email: '',
      },
    }
  },
  validations: {
    form: {
      email: {
        required,
        email,
        isUnique (value) {
          if (value === '') return true
          return this.invitations.findIndex(e => e.email === value) < 0
        },
      },
    },
  },
  computed: {
    emailErrorMessage () {
      const m = this.$v.form.email
      if (!m.required) return this.$t('VALIDATION.REQUIRED')
      if (!m.email) return this.$t('VALIDATION.VALID_EMAIL')
      if (!m.isUnique) return this.$t('GROUP.ALREADY_INVITED')
    },
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) return
      this.$emit('submit', this.form.email)
      this.$v.form.$reset()
      this.form.email = ''
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
