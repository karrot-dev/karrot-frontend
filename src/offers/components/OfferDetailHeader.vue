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
    <router-link
      :to="{ name: 'offerEdit', params: { offerId: offer.id } }"
    >
      edit
    </router-link>
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
      offer: 'offers/current',
    }),
  },
  methods: {
    close () {
      this.$router.push({ name: 'groupOffers' })
    },
  },
}
</script>
