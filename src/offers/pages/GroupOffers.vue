<template>
  <div>
    <QResizeObserver
      style="width: 100%"
      @resize="onResize"
    />
    <div>
      <div
        class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs"
      >
        <QSelect
          v-model="status"
          :options="statusOptions"
          emit-value
          map-options
          outlined
          hide-bottom-space
          dense
        />
        <QBtn
          small
          round
          color="secondary"
          icon="fas fa-gift"
          :to="{ name: 'offerCreate' }"
          :title="$t('OFFER.CREATE_TITLE')"
        />
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
            v-if="offer.images[0]"
            class="photo text-white relative-position row justify-center"
          >
            <img :src="offer.images[0].imageUrls.fullSize">
          </div>
          <QCardSection class="fixed-height smaller-text">
            <ProfilePicture
              :user="offer.user"
              :size="30"
            />
            <router-link :to="detailRouteFor(offer.id)">
              {{ offer.name }}
            </router-link>
          </QCardSection>
        </QCard>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { QBtn, QSelect, QCard, QCardSection, QResizeObserver } from 'quasar'
import ProfilePicture from '@/users/components/ProfilePicture'
import bindRoute from '@/utils/mixins/bindRoute'

export default {
  components: {
    ProfilePicture,
    QBtn,
    QSelect,
    QCard,
    QCardSection,
    QResizeObserver,
  },
  mixins: [
    bindRoute({
      status: 'active',
    }),
  ],
  data () {
    return {
      width: 200,
      statusOptions: [
        {
          label: 'Available',
          value: 'active',
        },
        {
          label: 'My accepted offers',
          value: 'accepted',
        },
        {
          label: 'My archived offers',
          value: 'archived',
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      offers: 'offers/all',
      routeQuery: 'offers/routeQuery',
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
  watch: {
    status: {
      immediate: true,
      handler (status) {
        this.fetchList({ status })
      },
    },
  },
  methods: {
    ...mapActions({
      fetchList: 'offers/fetchList',
    }),
    visit (id) {
      this.$router.push(this.detailRouteFor(id))
    },
    onResize ({ width }) {
      this.width = width
    },
    detailRouteFor (offerId) {
      return {
        name: 'offerDetail',
        params: { offerId },
        query: this.routeQuery,
      }
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
