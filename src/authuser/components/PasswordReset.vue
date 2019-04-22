<template>
  <div>
    <form
      name="passwordReset"
      @submit.prevent="submit"
    >
      <div class="content">
        <div class="white-box">
          <QField
            icon="fas fa-lock"
            :error="hasError('newPassword')"
            :error-label="firstError('newPassword')"
          >
            <QInput
              v-model="newPassword"
              type="password"
              :float-label="$t('USERDATA.PASSWORD')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </QField>
        </div>
        <div
          v-if="hasError('code')"
          class="error"
        >
          <i class="fas fa-exclamation-triangle" />
          {{ $t('GLOBAL.INVALID_LINK') }}
        </div>
        <div
          v-if="hasNonFieldError"
          class="error"
        >
          <i class="fas fa-exclamation-triangle" />
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
  QField,
  QInput,
  QBtn,
} from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QField,
    QInput,
    QBtn,
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

<style scoped lang="stylus">
  .margin-bottom
    margin 0 0 24px 0
</style>
