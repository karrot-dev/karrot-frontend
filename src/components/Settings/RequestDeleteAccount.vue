<template>
  <div>
    <q-btn
      icon="fa-trash"
      flat
      color="negative"
      @click="requestDeleteAccount"
      loader
      :value="isPending || dialogShown"
    >
      {{ $t('BUTTON.DELETE_ACCOUNT') }}
    </q-btn>
    <div
      v-if="hasNonFieldError"
      class="text-negative"
    >
      {{ firstNonFieldError }}
    </div>
  </div>
</template>

<script>
import { QField, QInput, QBtn } from 'quasar'
import statusMixin from '@/mixins/statusMixin'
import { Dialog } from 'quasar-framework'

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
        buttons: [
          {
            label: this.$t('BUTTON.CANCEL'),
            handler: () => {
              this.dialogShown = false
            },
          },
          {
            label: this.$t('USERDATA.DIALOGS.REQUEST_DELETE_ACCOUNT.CONFIRM'),
            handler: () => {
              this.$emit('requestDeleteAccount')
              this.dialogShown = false
            },
          },
        ],
      })
    },
  },
}
</script>

<style scoped lang="stylus"></style>
