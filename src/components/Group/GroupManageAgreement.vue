<template>
  <div>
    <h3><i class="fa fa-edit" /> {{ $t('GROUP.MANAGE_AGREEMENT') }}</h3>
    <q-card v-if="showForm">
      <agreement-form
        :value="agreement"
        @save="$emit('save', arguments[0])"
        @replace="$emit('replace', arguments[0])"
        @cancel="cancel()"
        @destroy="$emit('remove', arguments[0])"
      />
    </q-card>

    <q-card v-else>
      <q-card-main class="generic-padding">
        <p>{{ $t('AGREEMENT.BLURB1') }}</p>
        <p>{{ $t('AGREEMENT.BLURB2') }}</p>
      </q-card-main>
      <q-card-actions class="generic-padding">
        <q-btn
          color="primary"
          @click="newAgreement()"
        >
          {{ $t('AGREEMENT.NEW') }}
        </q-btn>
      </q-card-actions>
    </q-card>

  </div>
</template>

<script>
import { QCard, QCardMain, QCardActions, QCardSeparator, QBtn } from 'quasar'

import AgreementForm from '@/components/Group/AgreementForm'

export default {
  name: 'GroupManageAgreement',
  props: {
    agreement: {
      type: Object,
      default: () => ({
        title: undefined,
        content: undefined,
      }),
    },
  },
  data () {
    return {
      create: false,
    }
  },
  components: {
    QCard, QCardMain, QCardActions, QCardSeparator, QBtn, AgreementForm,
  },
  computed: {
    showForm () {
      return this.create || this.agreement.id
    },
  },
  methods: {
    newAgreement () {
      this.create = true
      /*
      this.agreement = {
        title: '',
        content: '',
      }
      */
    },
    cancel () {
      // this.agreement = null
    },
  },
}
</script>
