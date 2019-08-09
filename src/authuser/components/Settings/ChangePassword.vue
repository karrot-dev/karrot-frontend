<template>
  <div class="edit-box">
    <QInput
      v-model="newPassword"
      type="password"
      :label="$t('USERDETAIL.PASSWORD')"
      :error="hasError('newPassword')"
      :error-message="firstError('newPassword')"
    >
      <template v-slot:before>
        <QIcon name="fas fa-lock" />
      </template>
    </QInput>

    <QInput
      v-model="oldPassword"
      type="password"
      :label="$t('USERDETAIL.OLD_PASSWORD')"
      :error="hasError('oldPassword')"
      :error-message="firstError('oldPassword')"
    >
      <template v-slot:before>
        <QIcon name="fas fa-unlock" />
      </template>
    </QInput>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>

    <div class="actionButtons">
      <QBtn
        color="primary"
        :disable="!hasNewPassword || !hasOldPassword || !hasPasswordChanged"
        :loading="isPending"
        @click="save"
      >
        {{ $t('BUTTON.CHANGE_PASSWORD') }}
      </QBtn>
    </div>
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
      oldPassword: '',
      newPassword: '',
    }
  },
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
