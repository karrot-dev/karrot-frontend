<template>
  <div>
    <form name="login" @submit.prevent="submit">
      <div class="white-box" :class="{ shake: showShake }">
        <q-field icon="fa-envelope">
          <q-input
          :autofocus="true"
          :error="hasError('email')"
          :float-label="$t('USERDATA.EMAIL')"
          type="email"
          v-model="email"
          autocorrect="off" autocapitalize="off" spellcheck="false"
          />
        </q-field>
      </div>
      <div class="white-box" :class="{ shake: showShake }">
        <q-field icon="fa-lock">
          <q-input
          :error="hasError('password')"
          v-model="password"
          type="password"
          :float-label="$t('USERDATA.PASSWORD')"
          autocorrect="off" autocapitalize="off" spellcheck="false"
          />
        </q-field>
      </div>
      <div class="error" v-if="errorMessage">
        <i class="fa fa-exclamation-triangle"/>{{ errorMessage }}
      </div>
      <div class="actions">
        <q-btn type="button" @click.prevent="$router.push({ name: 'passwordreset' })" flat>
          {{ $t('LOGIN.FORGOT_PASSWORD') }}
        </q-btn>
        <q-btn type="button" @click.prevent="$router.push({ name: 'signup' })" flat>
          {{ $t('LOGIN.SIGNUP') }}
        </q-btn>
        <q-btn type="submit" class="submit shadow-4" loader :value="status.isWaiting">
          {{ $t('LOGIN.SUBMIT') }}
        </q-btn>
      </div>
      <div style="clear: both"/>
    </form>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'

export default {
  components: { QField, QInput, QBtn },
  data () {
    if (process.env.NODE_ENV !== 'production') {
      return {
        email: 'foo@foo.com',
        password: 'foofoo',
      }
    }
    else {
      return {
        email: '',
        password: '',
      }
    }
  },
  props: {
    status: {
      required: true,
    },
  },
  methods: {
    hasError (field) {
      return this.status.error && this.status.error[field]
    },
    submit () {
      // if (!this.status.isWaiting) {
      this.$emit('submit', { email: this.email, password: this.password })
      // }
    },
  },
  computed: {
    errorMessage () {
      return this.status.error && this.status.error[Object.keys(this.status.error)[0]][0]
    },
    showShake () {
      return typeof this.errorMessage !== 'undefined' && this.errorMessage !== null
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.shake
  animation shake 0.82s cubic-bezier(.36, .07, .19, .97) both
  transform translate3d(0, 0, 0)
  backface-visibility hidden
  perspective 1000px

@keyframes shake
  10%, 90%
    transform translate3d(-1px, 0, 0)
  20%, 80%
    transform translate3d(2px, 0, 0)
  30%, 50%, 70%
    transform translate3d(-4px, 0, 0)
  40%, 60%
    transform translate3d(4px, 0, 0)
</style>
