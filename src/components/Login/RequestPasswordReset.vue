<template>
  <div>
    <form
      name="requestPasswordReset"
      @submit.prevent="$emit('submit', email)"
    >
      <div>
        <p>
          {{ $t('PASSWORDRESET.INTRO') }}
        </p>
        <div class="white-box">
          <q-field icon="fas fa-envelope">
            <q-input
              :autofocus="true"
              :float-label="$t('PASSWORDRESET.EMAIL')"
              type="email"
              v-model="email"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              :error="hasError('email')"
            />
          </q-field>
        </div>

        <div
          v-if="hasAnyError"
          class="error"
        >
          <i class="fas fa-exclamation-triangle"/>
          {{ anyFirstError }}
        </div>

        <div class="actions">
          <q-btn
            type="button"
            :to="{ name: 'login' }"
            flat
          >
            {{ $t('PASSWORDRESET.LOGIN') }}
          </q-btn>
          <q-btn
            type="submit"
            class="submit shadow-4"
            :loading="isPending"
          >
            {{ $t('PASSWORDRESET.SUBMIT') }}
          </q-btn>
        </div>
        <div style="clear: both"/>
      </div>
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
    return {
      email: '',
    }
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
