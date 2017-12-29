<template>
  <div>
    <form
      name="login"
      @submit.prevent="submit"
    >
      <div
        class="white-box"
        :class="{ shake: hasAnyError }"
      >
        <q-field icon="fa-envelope">
          <q-input
            :autofocus="true"
            :error="hasError('email')"
            :float-label="$t('USERDATA.EMAIL')"
            type="email"
            v-model="email"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </q-field>
      </div>
      <div
        class="white-box"
        :class="{ shake: hasAnyError }"
      >
        <q-field icon="fa-lock">
          <q-input
            :error="hasError('password')"
            v-model="password"
            type="password"
            :float-label="$t('USERDATA.PASSWORD')"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </q-field>
      </div>
      <div
        v-if="hasAnyError"
        class="error"
      >
        <i class="fa fa-exclamation-triangle"/>
        {{ anyFirstError }}
      </div>
      <div class="actions">
        <q-btn
          type="button"
          @click.prevent="$router.push({ name: 'passwordreset' })"
          flat
        >
          {{ $t('LOGIN.FORGOT_PASSWORD') }}
        </q-btn>
        <q-btn
          type="button"
          @click.prevent="$router.push({ name: 'signup' })"
          flat
        >
          {{ $t('LOGIN.SIGNUP') }}
        </q-btn>
        <q-btn
          type="submit"
          class="submit shadow-4"
          loader
          :value="isPending"
        >
          {{ $t('LOGIN.SUBMIT') }}
        </q-btn>
      </div>
      <div style="clear: both"/>
    </form>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QField, QInput, QBtn },
  mixins: [statusMixin],
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
  methods: {
    submit () {
      this.$emit('submit', { email: this.email, password: this.password })
    },
  },
}
</script>

<style scoped lang="stylus">
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
