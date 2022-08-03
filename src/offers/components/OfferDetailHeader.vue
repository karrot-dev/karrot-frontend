<template>
  <QToolbar
    v-if="offer"
    class="bg-secondary text-white"
  >
    <QToolbarTitle class="column">
      <div>{{ offer.name }}</div>
    </QToolbarTitle>
    <QBtn
      v-if="canEdit"
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
import { QBtn, QToolbar, QToolbarTitle } from 'quasar'
import { useAuthService } from '@/authuser/services'
import { useActiveOfferService } from '@/offers/services'

export default {
  components: {
    QBtn,
    QToolbar,
    QToolbarTitle,
  },
  setup () {
    const { offer } = useActiveOfferService()
    const { userId: currentUserId } = useAuthService()
    return {
      offer,
      currentUserId,
    }
  },
  computed: {
    canEdit () {
      return this.offer.user === this.currentUserId
    },
  },
  methods: {
    close () {
      this.$router.push({ name: 'groupOffers', query: this.$route.query })
    },
  },
}
</script>
