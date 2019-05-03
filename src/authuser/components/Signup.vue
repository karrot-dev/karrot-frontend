<template>
  <div>
    <form
      name="signup"
      @submit.prevent="submit"
    >
      <div class="content">
        <div class="white-box">
          <QField
            icon="fas fa-user"
            :error="hasDisplayNameError"
            :error-label="displayNameError"
          >
            <QInput
              v-model="user.displayName"
              :autofocus="true"
              :float-label="$t('USERDATA.USERNAME')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              @blur="$v.user.displayName.$touch"
            />
          </QField>
        </div>
        <div class="white-box">
          <QField
            icon="fas fa-envelope"
            :error="hasError('email')"
            :error-label="firstError('email')"
          >
            <QInput
              v-model="user.email"
              type="email"
              :float-label="$t('USERDATA.EMAIL')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </QField>
        </div>
        <div class="white-box">
          <QField
            icon="fas fa-lock"
            :error="hasError('password')"
            :error-label="firstError('password')"
          >
            <QInput
              v-model="user.password"
              type="password"
              :float-label="$t('USERDATA.PASSWORD')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </QField>
        </div>
        <div v-if="canJoinPlayground">
          <QCheckbox
            v-model="joinPlayground"
            color="white"
            :label="$t('GROUP.JOIN_PLAYGROUND')"
            class="playground-checkbox"
          />
          <QAlert
            v-if="joinPlayground"
            color="info"
            icon="info"
            class="q-my-md"
          >
            {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
          </QAlert>
        </div>

        <div
          v-if="hasNonFieldError"
          class="error"
        >
          <i class="fas fa-exclamation-triangle" />
          {{ firstNonFieldError }}
        </div>

        <div class="actions">
          <QBtn
            type="button"
            :to="{ name: 'login' }"
            flat
          >
            {{ $t('SIGNUP.BACK') }}
          </QBtn>
          <QBtn
            type="submit"
            class="submit shadow-4"
            :loading="isPending"
          >
            {{ $t('SIGNUP.OK') }}
          </QBtn>
        </div>
        <div style="clear: both" />
      </div>
    </form>
  </div>
</template>

<script>
import {
  QField,
  QInput,
  QAlert,
  QBtn,
  QCheckbox,
} from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    QField,
    QInput,
    QAlert,
    QBtn,
    QCheckbox,
  },
  mixins: [validationMixin, statusMixin],
  props: {
    prefillEmail: {
      required: true,
      type: Function,
    },
    hasPlayground: {
      default: false,
      type: Boolean,
    },
    hasGroupToJoin: {
      default: false,
      type: Boolean,
    },
  },
  data () {
    return {
      user: {
        displayName: null,
        email: this.prefillEmail(),
        password: null,
      },
      joinPlayground: this.hasPlayground && !this.hasGroupToJoin,
    }
  },
  computed: {
    canJoinPlayground () {
      return this.hasPlayground && !this.hasGroupToJoin
    },
    hasDisplayNameError () {
      return !!this.displayNameError
    },
    displayNameError () {
      if (this.$v.user.displayName.$error) {
        const m = this.$v.user.displayName
        if (!m.required) return this.$t('VALIDATION.REQUIRED')
        if (!m.minLength) return this.$t('VALIDATION.MINLENGTH', { min: 2 })
        if (!m.maxLength) return this.$t('VALIDATION.MAXLENGTH', { max: 81 })
      }
      return this.firstError('displayName')
    },
    canSave () {
      if (this.$v.user.$error) {
        return false
      }
      return true
    },
  },
  watch: {
    canJoinPlayground (val) {
      this.joinPlayground = val
    },
  },
  methods: {
    submit () {
      this.$v.user.$touch()
      if (!this.canSave || this.isPending) return
      this.$emit('submit', {
        userData: this.user,
        joinPlayground: this.joinPlayground,
      })
      this.$v.user.$reset()
    },
  },
  validations: {
    user: {
      displayName: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(80),
      },
    },
  },
}
</script>

<style scoped lang="stylus">
  .margin-bottom
    margin 0 0 24px 0
  .playground-checkbox
    margin-left 20px
    margin-top 10px
    >>> .q-option-label
      margin-left 18px
</style>
