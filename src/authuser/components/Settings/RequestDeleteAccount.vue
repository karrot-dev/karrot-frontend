<template>
  <div>
    <QBtn
      icon="fas fa-trash-alt"
      :label="$t('BUTTON.DELETE_ACCOUNT')"
      flat
      color="negative"
      :loading="isPending || dialogShown"
      @click="requestDeleteAccount"
    />
    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>
  </div>
</template>

<script>
import {
  QBtn,
  Dialog,
} from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: { QBtn },
  mixins: [statusMixin],
  data () {
    return {
      dialogShown: false,
    }
  },
  methods: {
    requestDeleteAccount () {
      this.dialogShown = true
      Dialog.create({
        title: this.$t('USERDATA.DIALOGS.REQUEST_DELETE_ACCOUNT.TITLE'),
        message: this.$t('USERDATA.DIALOGS.REQUEST_DELETE_ACCOUNT.MESSAGE'),
        cancel: this.$t('BUTTON.CANCEL'),
        ok: this.$t('USERDATA.DIALOGS.REQUEST_DELETE_ACCOUNT.CONFIRM'),
      })
        .onOk(() => {
          this.$emit('request-delete-account')
        })
        .onDismiss(() => {
          this.dialogShown = false
        })
    },
  },
}
</script>

<style scoped lang="stylus"></style>
