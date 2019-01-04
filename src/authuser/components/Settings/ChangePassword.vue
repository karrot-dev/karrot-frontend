<template>
  <div class="edit-box">
    <QField
      icon="fas fa-lock"
      :label="$t('USERDETAIL.PASSWORD')"
      :error="hasError('newPassword')"
      :error-label="firstError('newPassword')"
    >
      <QInput
        type="password"
        v-model="newPassword"
      />
    </QField>
    <QField
      icon="fas fa-unlock"
      :label="$t('USERDETAIL.OLD_PASSWORD')"
      :error="hasError('oldPassword')"
      :error-label="firstError('oldPassword')"
    >
      <QInput
        type="password"
        v-model="oldPassword"
      />
    </QField>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>

    <div class="actionButtons">
      <QBtn
        color="primary"
        @click="save"
        :disable="!hasNewPassword || !hasOldPassword || !hasPasswordChanged"
        :loading="isPending"
      >
        {{ $t('BUTTON.CHANGE_PASSWORD') }}
      </QBtn>
    </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: { QField, QInput, QBtn },
  mixins: [statusMixin],
  computed: {
    hasNewPassword () {
      return !!this.newPassword
    },
    hasOldPassword () {
      return !!this.oldPassword
    },
    hasPasswordChanged () {
      return this.oldPassword !== this.newPassword
    },
  },
  data () {
    return {
      oldPassword: '',
      newPassword: '',
    }
  },
  methods: {
    reset () {
      this.oldPassword = ''
      this.newPassword = ''
    },
    save () {
      const { oldPassword, newPassword } = this
      this.$emit('save', { oldPassword, newPassword, done: this.reset })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~editbox'
</style>
