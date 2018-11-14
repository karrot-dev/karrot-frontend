<template>
  <div>
    <q-card class="bg-warning margin-bottom">
      <q-card-title>
        <q-icon name="fas fa-exclamation-triangle" />
        {{ $t('GLOBAL.WARNING') }}
      </q-card-title>
      <q-card-main>
        {{ $t('GLOBAL.BETA_WARNING') }}
      </q-card-main>
    </q-card>
    <form
      name="signup"
      @submit.prevent="submit"
    >
      <div class="content">
        <div class="white-box">
          <q-field
            icon="fas fa-user"
            :error="hasDisplayNameError"
            :error-label="displayNameError"
          >
            <q-input
              :autofocus="true"
              v-model="user.displayName"
              :float-label="$t('USERDATA.USERNAME')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              @blur="$v.user.displayName.$touch"
            />
          </q-field>
        </div>
        <div class="white-box">
          <q-field
            icon="fas fa-envelope"
            :error="hasError('email')"
            :error-label="firstError('email')"
          >
            <q-input
              v-model="user.email"
              type="email"
              :float-label="$t('USERDATA.EMAIL')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </q-field>
        </div>
        <div class="white-box">
          <q-field
            icon="fas fa-lock"
            :error="hasError('password')"
            :error-label="firstError('password')"
          >
            <q-input
              v-model="user.password"
              type="password"
              :float-label="$t('USERDATA.PASSWORD')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </q-field>
        </div>
        <div v-if="canJoinPlayground">
          <q-checkbox
            v-model="joinPlayground"
            color="white"
            :label="$t('GROUP.JOIN_PLAYGROUND')"
            class="playground-checkbox"
          />
        </div>

        <div
          v-if="hasNonFieldError"
          class="error"
        >
          <i class="fas fa-exclamation-triangle"/>
          {{ firstNonFieldError }}
        </div>

        <div class="actions">
          <q-btn
            type="button"
            :to="{ name: 'login' }"
            flat
          >
            {{ $t('SIGNUP.BACK') }}
          </q-btn>
          <q-btn
            type="submit"
            class="submit shadow-4"
            :loading="isPending"
          >
            {{ $t('SIGNUP.OK') }}
          </q-btn>
        </div>
        <div style="clear: both"/>
      </div>
    </form>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QIcon, QField, QInput, QBtn, QSpinner, QCheckbox } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
  components: { QCard, QCardTitle, QCardMain, QIcon, QField, QInput, QBtn, QSpinner, QCheckbox },
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
