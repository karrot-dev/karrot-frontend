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
    <form name="signup" @keydown.enter.prevent="submit">
      <div class="content">
        <div class="white-box">
          <q-field icon="fa-user">
            <q-input
            :autofocus="true"
            v-model="user.displayName"
            :float-label="$t('USERDATA.USERNAME')"
            autocorrect="off" autocapitalize="off" spellcheck="false"
            />
          </q-field>
        </div>
        <div class="white-box">
          <q-field icon="fa-envelope">
            <q-input
            v-model="user.email"
            type="email"
            :float-label="$t('USERDATA.EMAIL')"
            autocorrect="off" autocapitalize="off" spellcheck="false"
            />
          </q-field>
        </div>
        <div class="white-box">
          <q-field icon="fa-lock">
            <q-input
            v-model="user.password"
            type="password"
            :float-label="$t('USERDATA.PASSWORD')"
            autocorrect="off" autocapitalize="off" spellcheck="false"
            />
          </q-field>
        </div>
        <div class="actions">
          <q-btn @click="$router.push({ name: 'login' })" flat>
            {{ $t('SIGNUP.BACK') }}
          </q-btn>
          <q-btn @click.prevent="submit" class="submit shadow-4" loader :value="status.isWaiting">
            {{ $t('SIGNUP.OK') }}
          </q-btn>
        </div>
        <div style="clear: both"/>
        <pre v-if="status.error">{{ status.error }}</pre>
      </div>
    </form>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QIcon, QField, QInput, QBtn, QSpinner } from 'quasar'
import loginImage from '@/assets/people/cherry.png'

export default {
  components: { QCard, QCardTitle, QCardMain, QIcon, QField, QInput, QBtn, QSpinner },
  props: {
    status: {
      required: true,
    },
  },
  data () {
    return {
      loginImage,
      user: {
        displayName: null,
        email: null,
        password: null,
      },
    }
  },
  methods: {
    submit () {
      if (!this.status.isWaiting) {
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
