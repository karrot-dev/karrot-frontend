<template>
  <div class="edit-box">
    <div class="text-h5 text-primary q-mb-lg">
      {{ $t('USERDATA.PASSWORD') }}
    </div>
    <QInput
      v-model="newPassword"
      type="password"
      :label="$t('USERDETAIL.PASSWORD')"
      :error="hasError('newPassword')"
      :error-message="firstError('newPassword')"
      data-testid="change-password-new-password"
      outlined
    >
      <template #before>
        <QIcon name="fas fa-lock" />
      </template>
    </QInput>

    <QInput
      v-model="oldPassword"
      type="password"
      :label="$t('USERDETAIL.OLD_PASSWORD')"
      :error="hasError('oldPassword')"
      :error-message="firstError('oldPassword')"
      data-testid="change-password-old-password"
      outlined
    >
      <template #before>
        <QIcon name="fas fa-unlock" />
      </template>
    </QInput>

    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>

    <div class="row justify-end q-gutter-sm q-mt-sm">
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
  emits: [
    'save',
  ],
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

<style scoped lang="sass">
@import 'editbox'
</style>
