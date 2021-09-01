<template>
  <div>
    <h3><i class="fas fa-pencil-alt" /> {{ $t('GROUP.MANAGE_AGREEMENT') }}</h3>
    <QCard v-if="showForm">
      <AgreementForm
        :value="agreement"
        @save="(...args) => $emit('save', ...args)"
        @replace="(...args) => $emit('replace', ...args)"
        @cancel="cancel()"
        @destroy="(...args) => $emit('remove', ...args)"
      />
    </QCard>

    <QCard v-else>
      <QCardSection class="generic-padding">
        <p>{{ $t('AGREEMENT.BLURB1') }}</p>
        <p>{{ $t('AGREEMENT.BLURB2') }}</p>
      </QCardSection>
      <QCardActions class="generic-padding">
        <QBtn
          color="primary"
          @click="newAgreement()"
        >
          {{ $t('AGREEMENT.NEW') }}
        </QBtn>
      </QCardActions>
    </QCard>
  </div>
</template>

<script>
import {
  QCard,
  QCardSection,
  QCardActions,
  QBtn,
} from 'quasar'

import AgreementForm from '@/agreements/components/AgreementForm'

export default {
  name: 'GroupManageAgreement',
  components: {
    QCard,
    QCardSection,
    QCardActions,
    QBtn,
    AgreementForm,
  },
  props: {
    agreement: {
      type: Object,
      default: () => ({
        title: undefined,
        content: undefined,
      }),
    },
  },
  emits: [
    'save',
    'replace',
    'remove',
  ],
  data () {
    return {
      create: false,
    }
  },
  computed: {
    showForm () {
      return this.create || this.agreement.id
    },
  },
  methods: {
    newAgreement () {
      this.create = true
    },
    cancel () {
      this.create = false
    },
  },
}
</script>
