<template>
  <QToolbar
    v-if="offer"
    class="bg-secondary text-white"
  >
    <QToolbarTitle
      class="column"
    >
      <div>{{ offer.name }}</div>
    </QToolbarTitle>
    <QBtn
      v-if="offer.canEdit"
      :to="{ name: 'offerEdit', params: { offerId: offer.id } }"
      flat
      round
      dense
      icon="edit"
      :title="$t('BUTTON.EDIT')"
    />
    <QBtn
      v-if="!$q.platform.is.mobile"
      flat
      round
      dense
      icon="close"
      :title="$t('BUTTON.CLOSE')"
      @click="close()"
    />
  </QToolbar>
</template>

<script>
import { mapGetters } from 'vuex'
import { QBtn, QToolbar, QToolbarTitle } from 'quasar'

export default {
  components: {
    QBtn,
    QToolbar,
    QToolbarTitle,
  },
  computed: {
    ...mapGetters({
      offer: 'currentOffer/value',
    }),
  },
  methods: {
    close () {
      this.$router.push({ name: 'groupOffers' })
    },
  },
}
</script>
