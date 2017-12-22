<template>
  <div>
    <q-card class="bg-tertiary margin-bottom">
      <q-card-title>
        <q-icon name="fa-exclamation-triangle" />
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
            icon="fa-user"
            :error="hasError('displayName')"
            :error-label="firstError('displayName')"
          >
            <q-input
              :autofocus="true"
              v-model="user.displayName"
              :float-label="$t('USERDATA.USERNAME')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </q-field>
        </div>
        <div class="white-box">
          <q-field
            icon="fa-envelope"
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
            icon="fa-lock"
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

        <div
          v-if="hasNonFieldError"
          class="error"
        >
          <i class="fa fa-exclamation-triangle"/>
          <div>
            {{ firstNonFieldError }}
          </div>
        </div>

        <div class="actions">
          <q-btn
            type="button"
            @click="$router.push({ name: 'login' })"
            flat
          >
            {{ $t('SIGNUP.BACK') }}
          </q-btn>
          <q-btn
            type="submit"
            class="submit shadow-4"
            loader
            :value="isPending"
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
import { QCard, QCardTitle, QCardMain, QIcon, QField, QInput, QBtn, QSpinner } from 'quasar'
import loginImage from 'assets/people/cherry.png'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QCard, QCardTitle, QCardMain, QIcon, QField, QInput, QBtn, QSpinner },
  mixins: [statusMixin],
  props: {
    prefillEmail: {
      required: true,
      type: Function,
    },
  },
  data () {
    return {
      loginImage,
      user: {
        displayName: null,
        email: this.prefillEmail(),
        password: null,
      },
    }
  },
  methods: {
    submit () {
      if (!this.isPending) {
        this.$emit('submit', this.user)
      }
    },
  },
}
</script>

<style scoped lang="stylus">
  .margin-bottom
    margin 0 0 24px 0
</style>
