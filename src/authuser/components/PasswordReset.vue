<template>
  <div>
    <form
      name="passwordReset"
      @submit.prevent="submit"
    >
      <div class="q-gutter-md">
        <SplashInput
          v-model="newPassword"
          type="password"
          icon="fas fa-lock"
          :label="$t('USERDETAIL.PASSWORD')"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          :error="hasError('newPassword')"
          :error-message="firstError('newPassword')"
        />
        <div
          v-if="hasError('code')"
          class="text-warning"
        >
          <i :class="$icon(exclamation_triangle)" />
          {{ $t('GLOBAL.INVALID_LINK') }}
        </div>
        <div
          v-if="hasNonFieldError"
          class="text-warning"
        >
          <i :class="$icon(exclamation_triangle)" />
          {{ firstNonFieldError }}
        </div>

        <div class="actions">
          <QBtn
            type="submit"
            class="submit shadow-4"
            :loading="isPending"
          >
            {{ $t('PASSWORD.RESET.OK') }}
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
import SplashInput from '@/utils/components/SplashInput'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QBtn,
    SplashInput,
  },
  mixins: [statusMixin],
  props: {
    code: {
      required: true,
      type: String,
    },
  },
  data () {
    return {
      newPassword: null,
    }
  },
  methods: {
    submit () {
      if (!this.isPending) {
        this.$emit('submit', { newPassword: this.newPassword, code: this.code })
      }
    },
  },
}
</script>
