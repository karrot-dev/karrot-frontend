<template>
  <div>
    <form @submit.prevent="maybeSave">
      <QField
        icon="fas fa-envelope"
        :helper="$t('GROUP.INVITE_EMAIL')"
        :error="hasErrorMessage"
        :error-label="errorMessage"
      >
        <QInput
          v-model="form.email"
          type="email"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @blur="$v.form.email.$touch"
        />
      </QField>

      <div class="row justify-end">
        <QBtn
          type="submit"
          :loading="isPending"
          :disable="!canSave"
          color="secondary"
          style="min-width: 5.5em"
        >
          <QIcon name="fas fa-paper-plane" />
          <QTooltip>
            {{ $t('GROUP.INVITE_SEND') }}
          </QTooltip>
        </QBtn>
      </div>
    </form>
  </div>
</template>

<script>
import { QIcon, QField, QInput, QBtn, QTooltip } from 'quasar'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: { QIcon, QField, QInput, QBtn, QTooltip },
  mixins: [statusMixin, validationMixin],
  props: {
    invitations: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      form: {
        email: null,
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
    hasErrorMessage () {
      return Boolean(this.errorMessage)
    },
    errorMessage () {
      if (this.$v.form.email.$error) {
        const m = this.$v.form.email
        if (!m.required) return this.$t('VALIDATION.REQUIRED')
        if (!m.email) return this.$t('VALIDATION.VALID_EMAIL')
        if (!m.isUnique) return this.$t('GROUP.ALREADY_INVITED')
      }
      if (this.hasAnyError) return this.anyFirstError
      return undefined
    },
    canSave () {
      return !this.$v.form.$error
    },
  },
  watch: {
    isPending (val) {
      if (!val && !this.hasAnyError) this.form.email = ''
    },
  },
  methods: {
    maybeSave () {
      this.$v.form.$touch()
      if (!this.canSave) return
      this.$emit('submit', this.form.email)
      this.$v.form.$reset()
    },
  },
}
</script>
