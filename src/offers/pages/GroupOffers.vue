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
          icon="fas fa-plus"
          :to="{ name: 'offerCreate' }"
          :title="$t('OFFER.CREATE_TITLE')"
        />
      </div>
      <KSpinner v-show="fetching" />
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
          <QCardSection class="fixed-height row">
            <ProfilePicture
              class="col-auto q-mr-sm"
              :user="offer.user"
              :size="30"
            />
            <div class="text-subtitle1 ellipsis col">
              <router-link :to="detailRouteFor(offer.id)">
                {{ offer.name }}
              </router-link>
            </div>
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
import KSpinner from '@/utils/components/KSpinner'
import bindRoute from '@/utils/mixins/bindRoute'
import { DEFAULT_STATUS } from '@/offers/datastore/offers'

export default {
  components: {
    ProfilePicture,
    KSpinner,
    QBtn,
    QSelect,
    QCard,
    QCardSection,
    QResizeObserver,
  },
  mixins: [
    bindRoute({
      status: DEFAULT_STATUS,
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
      fetching: 'offers/fetching',
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
        query: this.$route.query,
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
