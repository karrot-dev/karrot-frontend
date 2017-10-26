<template>
  <div>
    <form v-if="!status.success" name="passwordreset" @submit="$emit('submit', email)">
      <div>
        <p>
          {{ $t('PASSWORDRESET.INTRO') }}
        </p>
        <div class="white-box">
          <q-field icon="fa-envelope">
            <q-input
            :autofocus="true"
            :float-label="$t('PASSWORDRESET.EMAIL')"
            type="email"
            v-model="email"
            autocorrect="off" autocapitalize="off" spellcheck="false"
            :error="!!serverError('email')"
            :error-label="serverError('email')"
            />
          </q-field>
        </div>

        <div v-if="status.error" class="error">
          <i class="fa fa-exclamation-triangle"/>
          <div>{{ serverError('nonFieldErrors') }}</div>
        </div>

        <div class="actions">
          <q-btn type="button" @click="$router.push({ name: 'login' })" flat>
            {{ $t('PASSWORDRESET.LOGIN') }}
          </q-btn>
          <q-btn type="submit" class="submit shadow-4" loader :value="status.isWaiting">
            {{ $t('PASSWORDRESET.SUBMIT') }}
          </q-btn>
        </div>
        <div style="clear: both"/>
      </div>
    </form>
    <p v-if="status.success">
      {{ $t('PASSWORDRESET.SUCCESS') }}
    </p>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'

export default {
  components: { QField, QInput, QBtn },
  data () {
    return {
      email: '',
    }
  },
  props: {
    status: { required: true },
    serverError: { required: true },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
