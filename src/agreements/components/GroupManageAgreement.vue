<template>
  <div>
    <h3><i class="fas fa-pencil-alt" /> {{ $t('GROUP.MANAGE_AGREEMENT') }}</h3>
    <QCard v-if="showForm">
      <AgreementForm
        :value="agreement"
        @save="$emit('save', arguments[0])"
        @replace="$emit('replace', arguments[0])"
        @cancel="cancel()"
        @destroy="$emit('remove', arguments[0])"
      />
    </QCard>

    <QCard v-else>
      <QCardMain class="generic-padding">
        <p>{{ $t('AGREEMENT.BLURB1') }}</p>
        <p>{{ $t('AGREEMENT.BLURB2') }}</p>
      </QCardMain>
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
  QCardMain,
  QCardActions,
  QBtn,
} from 'quasar'

import AgreementForm from '@/agreements/components/AgreementForm'

export default {
  name: 'GroupManageAgreement',
  components: {
    QCard,
    QCardMain,
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
