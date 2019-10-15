<template>
  <div>
    <form
      name="signup"
      @submit.prevent="submit"
    >
      <div class="q-gutter-md">
        <SplashInput
          v-model="user.displayName"
          icon="fas fa-user"
          :autofocus="!$q.platform.has.touch"
          :label="$t('USERDATA.USERNAME')"
          :error="hasDisplayNameError"
          :error-message="displayNameError"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @blur="$v.user.displayName.$touch"
        />
        <SplashInput
          v-model="user.email"
          icon="fas fa-envelope"
          type="email"
          :label="$t('USERDATA.EMAIL')"
          :error="hasError('email')"
          :error-message="firstError('email')"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <SplashInput
          v-model="user.password"
          icon="fas fa-lock"
          type="password"
          :label="$t('USERDATA.PASSWORD')"
          :error="hasError('password')"
          :error-message="firstError('password')"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <div v-if="canJoinPlayground">
          <QCheckbox
            v-model="joinPlayground"
            :label="$t('GROUP.JOIN_PLAYGROUND')"
            color="info"
          />
          <QBanner
            v-if="joinPlayground"
            class="bg-info text-white q-my-sm rounded-borders"
          >
            {{ $t('JOINGROUP.PROFILE_NOTE' ) }}
            <template v-slot:avatar>
              <QIcon name="info" />
            </template>
          </QBanner>
        </div>

        <div
          v-if="hasNonFieldError"
          class="text-warning"
        >
          <i :class="$icon(exclamation_triangle)" />
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
      </div>
    </form>
  </div>
</template>

<script>
import {
  QBanner,
  QBtn,
  QCheckbox,
  QIcon,
} from 'quasar'
import SplashInput from '@/utils/components/SplashInput'
import statusMixin from '@/utils/mixins/statusMixin'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'

export default {
  components: {
    QBanner,
    QBtn,
    QCheckbox,
    QIcon,
    SplashInput,
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
