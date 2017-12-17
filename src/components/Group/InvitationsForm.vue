<template>
  <div>
    <form @submit.prevent="submit">
      <q-field
        icon="fa-envelope"
        :helper="$t('GROUP.INVITE_EMAIL')"
        :error="!!emailErrorMessage"
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

      <div v-if="hasNonFieldError" class="text-negative">{{ firstNonFieldError }}</div>

      <q-btn type="submit" loader :value="isPending" :disabled="$v.form.$error">
        <q-icon name="fa-paper-plane" />
        <q-tooltip>
          {{ $t('GROUP.INVITE_SEND') }}
        </q-tooltip>
      </q-btn>
    </form>
  </div>
</template>

<script>
import { QIcon, QField, QInput, QBtn, QTooltip } from 'quasar'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import statusMixin from '@/mixins/statusMixin'

export default {
  mixins: [statusMixin, validationMixin],
  components: { QIcon, QField, QInput, QBtn, QTooltip },
  props: {
    invitations: { required: true },
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
          if (value === '' || !this.invitations) return true
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
      if (this.hasError('email')) return this.firstError('email')
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
</style>
