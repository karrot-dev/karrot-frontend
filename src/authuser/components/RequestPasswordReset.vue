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
          <QField icon="fas fa-envelope">
            <QInput
              v-model="email"
              :autofocus="true"
              :float-label="$t('PASSWORDRESET.EMAIL')"
              type="email"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              :error="hasError('email')"
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
            :to="{ name: 'login' }"
            flat
          >
            {{ $t('PASSWORDRESET.LOGIN') }}
          </QBtn>
          <QBtn
            type="submit"
            class="submit shadow-4"
            :loading="isPending"
          >
            {{ $t('PASSWORDRESET.SUBMIT') }}
          </QBtn>
        </div>
        <div style="clear: both" />
      </div>
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
    return {
      email: '',
    }
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
