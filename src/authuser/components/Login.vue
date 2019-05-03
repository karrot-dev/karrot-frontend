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
        <QField icon="fas fa-envelope">
          <QInput
            v-model="email"
            :autofocus="true"
            :error="hasError('email')"
            :float-label="$t('USERDATA.EMAIL')"
            type="email"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </QField>
      </div>
      <div
        class="white-box"
        :class="{ shake: hasAnyError }"
      >
        <QField icon="fas fa-lock">
          <QInput
            v-model="password"
            :error="hasError('password')"
            type="password"
            :float-label="$t('USERDATA.PASSWORD')"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
          />
        </QField>
      </div>
      <div
        v-if="hasAnyError"
        class="error"
      >
        <i class="fas fa-exclamation-triangle" />
        {{ anyFirstError }}
      </div>
      <div class="actions">
        <QBtn
          type="button"
          flat
          @click.prevent="$router.push({ name: 'requestPasswordReset' })"
        >
          {{ $t('LOGIN.FORGOT_PASSWORD') }}
        </QBtn>
        <QBtn
          type="button"
          flat
          @click.prevent="$router.push({ name: 'signup' })"
        >
          {{ $t('LOGIN.SIGNUP') }}
        </QBtn>
        <QBtn
          type="submit"
          class="submit shadow-4"
          :loading="isPending"
        >
          {{ $t('LOGIN.SUBMIT') }}
        </QBtn>
      </div>
      <div style="clear: both" />
    </form>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: { QField, QInput, QBtn },
  mixins: [statusMixin],
  data () {
    if (__ENV.DEV) {
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
