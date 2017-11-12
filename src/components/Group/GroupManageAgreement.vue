<template>
  <div>
    <h3><i class="fa fa-edit" /> {{ $t('GROUP.MANAGE_AGREEMENT') }}</h3>
    <q-card v-if="agreementEdit">
      <agreement-form :agreement="agreementEdit"
                      @save="$emit('save', arguments[0])"
                      @replace="$emit('replace', arguments[0])"
                      @cancel="cancel()"
                      @remove="remove()"/>
    </q-card>
    <q-card v-else>
      <q-card-main class="generic-padding">
        <p>{{ $t('AGREEMENT.BLURB1') }}</p>
        <p>{{ $t('AGREEMENT.BLURB2') }}</p>
      </q-card-main>
      <q-card-actions class="generic-padding">
        <q-btn color="primary" @click="newAgreement()">
          {{ $t('AGREEMENT.NEW') }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { QCard, QCardMain, QCardActions, QCardSeparator, QBtn, Dialog } from 'quasar'
import cloneDeep from 'clone-deep'

import AgreementForm from '@/components/Group/AgreementForm'

export default {
  name: 'GroupManageAgreement',
  props: {
    agreement: { required: false },
  },
  components: {
    QCard, QCardMain, QCardActions, QCardSeparator, QBtn, AgreementForm,
  },
  data () {
    return {
      agreementEdit: this.agreement ? cloneDeep(this.agreement) : null,
    }
  },
  watch: {
    agreement (val) {
      this.agreementEdit = cloneDeep(val)
    },
  },
  methods: {
    newAgreement () {
      this.agreementEdit = {
        title: '',
        content: '',
      }
    },
    cancel () {
      this.agreementEdit = null
    },
    remove (agreementId) {
      Dialog.create({
        title: this.$t('AGREEMENT.DIALOGS.REMOVE.TITLE'),
        message: this.$t('AGREEMENT.DIALOGS.REMOVE.MESSAGE'),
        buttons: [
          this.$t('BUTTON.CANCEL'),
          {
            label: this.$t('AGREEMENT.DIALOGS.REMOVE.CONFIRM'),
            handler: () => {
              this.$emit('remove', agreementId)
            },
          },
        ],
      })
    },
  },
}
</script>
