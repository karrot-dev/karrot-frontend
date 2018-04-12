<template>
  <div>
    <form
      name="passwordReset"
      @submit.prevent="submit"
    >
      <div class="content">
        <div class="white-box">
          <q-field
            icon="fa-lock"
            :error="hasError('newPassword')"
            :error-label="firstError('newPassword')"
          >
            <q-input
              v-model="newPassword"
              type="password"
              :float-label="$t('USERDATA.PASSWORD')"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
            />
          </q-field>
        </div>
        <div
          v-if="hasError('code')"
          class="error"
        >
          <i class="fa fa-exclamation-triangle"/>
          {{ $t('GLOBAL.INVALID_LINK') }}
        </div>
        <div
          v-if="hasNonFieldError"
          class="error"
        >
          <i class="fas fa-exclamation-triangle"/>
          {{ firstNonFieldError }}
        </div>

        <div class="actions">
          <q-btn
            type="submit"
            class="submit shadow-4"
            :loading="isPending"
          >
            {{ $t('PASSWORD.RESET.OK') }}
          </q-btn>
        </div>
        <div style="clear: both"/>
      </div>
    </form>
  </div>
</template>

<script>
import { QCard, QCardTitle, QCardMain, QIcon, QField, QInput, QBtn, QSpinner } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QCard, QCardTitle, QCardMain, QIcon, QField, QInput, QBtn, QSpinner },
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
