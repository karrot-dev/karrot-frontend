<template>
  <div>
    <h3><i class="fa fa fa-edit"></i> {{ $t('GROUP.EDIT_AGREEMENT') }}</h3>
    <q-card>
      <agreement-form v-if="agreementEdit" :agreement="agreementEdit" @save="$emit('save', arguments[0])" @cancel="cancel()"/>
      <div v-else>
        <p>You don't have an agreement yet!</p>
        <p>This will mean all your users have to agree to it before they can do pickups, blahblhablha</p>
        <q-btn @click="newAgreement()">
          create an agreement!
        </q-btn>
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QBtn } from 'quasar'
import cloneDeep from 'clone-deep'

import AgreementForm from '@/components/Group/AgreementForm'

export default {
  name: 'GroupEditAgreement',
  props: {
    agreement: { required: false },
  },
  components: {
    QCard, QBtn, AgreementForm,
  },
  data () {
    console.log('setting initial agrerementEdit on', this.agreement)
    return {
      agreementEdit: this.agreement ? cloneDeep(this.agreement) : null,
    }
  },
  watch: {
    agreement (val) {
      this.agreementEdit = val
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
      console.log('cancelled!')
      this.agreementEdit = null // and void
    },
  },
}
</script>
