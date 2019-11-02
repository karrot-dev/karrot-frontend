<template>
  <div>
    <QResizeObserver
      style="width: 100%"
      @resize="onResize"
    />
    <div>
      <div>
        <router-link :to="{ name: 'offerCreate' }">
          <h2>CLICK HERE TO OFFER A THING!!!</h2>
        </router-link>
      </div>
      <div
        v-for="offer in offers"
        :key="offer.id"
        class="offer inline-block"
        :style="offerStyle"
      >
        <QCard
          @click="visit(offer.id)"
        >
          <div
            class="photo text-white relative-position row justify-center"
          >
            <img :src="offer.photoUrls.fullSize">
          </div>
          <QCardSection class="fixed-height smaller-text">
            <QAvatar>
              <img
                v-if="offer.user.photoUrls !== undefined"
                :src="offer.user.photoUrls.thumbnail"
              >
            </QAvatar>
            <router-link :to="{ name: 'offerDetail', params: { offerId: offer.id } }">
              {{ offer.name }}
            </router-link>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { QAvatar, QCard, QCardSection, QResizeObserver } from 'quasar'

export default {
  components: {
    QAvatar,
    QCard,
    QCardSection,
    QResizeObserver,
  },
  data () {
    return {
      width: 200,
    }
  },
  computed: {
    ...mapGetters({
      offers: 'offers/all',
    }),
    cols () {
      return Math.max(1, Math.floor(this.width / 200))
    },
    offerStyle () {
      return {
        width: (100 / this.cols) + '%',
      }
    },
  },
  methods: {
    visit (id) {
      this.$router.push({ name: 'offerDetail', params: { offerId: id } })
    },
    onResize ({ width }) {
      this.width = width
    },
  },
}
</script>

<style scoped lang="stylus">
.offer
  cursor pointer
  .item-card
    width 100%
.photo
  height 160px
  overflow hidden
  img
    width 100%
</style>
