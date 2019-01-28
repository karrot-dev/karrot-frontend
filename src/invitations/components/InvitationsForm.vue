<template>
  <div>
    <form @submit.prevent="maybeSave">
      <QField
        icon="fas fa-envelope"
        :helper="helperMessage"
        dark
        class="white-font"
      >
        <QInput
          v-model="form.email"
          type="email"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          class="bg-grey-2"
          style="padding: 4px;"
          @blur="$v.form.email.$touch"
        />
      </QField>

      <QBtn
        type="submit"
        :loading="isPending"
        :disable="!canSave"
        class="bg-secondary float-right"
        style="min-width: 5.5em"
      >
        <QIcon name="fas fa-paper-plane" />
        <QTooltip>
          {{ $t('GROUP.INVITE_SEND') }}
        </QTooltip>
      </QBtn>
      <div style="clear:both"/>
    </form>
  </div>
</template>

<script>
import { QIcon, QField, QInput, QBtn, QTooltip } from 'quasar'
import { validationMixin } from 'vuelidate'
import { required, email } from 'vuelidate/lib/validators'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  mixins: [statusMixin, validationMixin],
  components: { QIcon, QField, QInput, QBtn, QTooltip },
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
        canSendOrResendInvitation (value) {
          let invite = this.invitations.find(e => e.email === value)
          if (invite) {
            let dateNow = new Date()
            let dateCreated = new Date(invite.createdAt)
            dateCreated.setHours(dateCreated.getHours() + 1)
            return dateNow >= dateCreated
          }
          else return true
        },
      },
    },
  },
  computed: {
    helperMessage () {
      if (this.$v.form.email.$error) {
        const m = this.$v.form.email
        if (!m.required) return this.$t('VALIDATION.REQUIRED')
        if (!m.email) return this.$t('VALIDATION.VALID_EMAIL')
        if (!m.canSendOrResendInvitation) return this.$t('GROUP.ALREADY_INVITED')
      }
      if (this.hasNonFieldError) return this.firstNonFieldError
      return this.$t('GROUP.INVITE_EMAIL')
    },
    canSave () {
      return !this.$v.form.$error
    },
  },
  methods: {
    maybeSave () {
      this.$v.form.$touch()
      if (!this.canSave) return
      this.$emit('submit', this.form.email)
      this.$v.form.$reset()
      this.form.email = ''
    },
  },
}
</script>

<style lang="stylus">
.q-field-dark.white-font
  .q-field-label, .q-field-icon, .q-field-counter, .q-field-bottom
    color white
</style>
