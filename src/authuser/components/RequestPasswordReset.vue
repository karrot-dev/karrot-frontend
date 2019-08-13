<template>
  <div>
    <form
      name="requestPasswordReset"
      @submit.prevent="$emit('submit', email)"
    >
      <div class="q-gutter-md">
        <p>
          {{ $t('PASSWORDRESET.INTRO') }}
        </p>
        <SplashInput
          v-model="email"
          icon="fas fa-envelope"
          autofocus
          :label="$t('PASSWORDRESET.EMAIL')"
          type="email"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :error="hasError('email')"
        />

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
  QBtn,
} from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import SplashInput from '@/authuser/components/SplashInput'

export default {
  components: {
    QBtn,
    SplashInput,
  },
  mixins: [statusMixin],
  data () {
    return {
      email: '',
    }
  },
}
</script>
