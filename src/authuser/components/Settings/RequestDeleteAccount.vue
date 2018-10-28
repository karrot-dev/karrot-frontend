<template>
  <div>
    <q-btn
      icon="fas fa-trash-alt"
      :label="$t('BUTTON.DELETE_ACCOUNT')"
      flat
      color="negative"
      @click="requestDeleteAccount"
      :loading="isPending"
      :value="isPending || dialogShown"
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
import { QField, QInput, QBtn, Dialog } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: { QField, QInput, QBtn },
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
        .then(() => {
          this.$emit('requestDeleteAccount')
          this.dialogShown = false
        })
        .catch(() => {
          this.dialogShown = false
        })
    },
  },
}
</script>

<style scoped lang="stylus"></style>
