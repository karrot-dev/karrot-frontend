<template>
  <div>
    <form
      name="signup"
      @submit.prevent="submit"
    >
      <div class="content">
        <div class="white-box">
          <QInput
            v-model="user.displayName"
            :autofocus="true"
            :label="$t('USERDATA.USERNAME')"
            :error="hasDisplayNameError"
            :error-message="displayNameError"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            @blur="$v.user.displayName.$touch"
          >
            <template v-slot:prepend>
              <QIcon name="fas fa-user" />
            </template>
          </QInput>
        </div>
        <div class="white-box">
          <QInput
            v-model="user.email"
            type="email"
            :label="$t('USERDATA.EMAIL')"
            :error="hasError('email')"
            :error-message="firstError('email')"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          >
            <template v-slot:prepend>
              <QIcon name="fas fa-envelope" />
            </template>
          </QInput>
        </div>
        <div class="white-box">
          <QInput
            v-model="user.password"
            type="password"
            :label="$t('USERDATA.PASSWORD')"
            :error="hasError('password')"
            :error-message="firstError('password')"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          >
            <template v-slot:prepend>
              <QIcon name="fas fa-lock" />
            </template>
          </QInput>
        </div>
        <div v-if="canJoinPlayground">
          <QCheckbox
            v-model="joinPlayground"
            color="white"
            :label="$t('GROUP.JOIN_PLAYGROUND')"
            class="playground-checkbox"
          />
          <QBanner
            v-if="joinPlayground"
            color="info"
            icon="info"
            class="q-my-md"
          >
            {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
          </QBanner>
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
  QIcon,
  QInput,
  QBanner,
  QBtn,
  QCheckbox,
} from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    QIcon,
    QInput,
    QBanner,
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
