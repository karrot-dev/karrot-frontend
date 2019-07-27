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
          <QInput
            v-model="email"
            :autofocus="true"
            :label="$t('PASSWORDRESET.EMAIL')"
            type="email"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            :error="hasError('email')"
          >
            <template v-slot:before>
              <QIcon name="fas fa-envelope" />
            </template>
          </QInput>
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
import {
  QInput,
  QBtn,
  QIcon,
} from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QInput,
    QBtn,
    QIcon,
  },
  mixins: [statusMixin],
  data () {
    return {
      email: '',
    }
  },
}
</script>
