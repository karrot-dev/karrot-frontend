<template>
  <div>
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
      </div>
      <KSpinner v-show="fetching" />
      <div class="row">
        <div
          v-if="status === 'active' && !fetching"
          class="col-md-4 col-sm-6 col-12 new-offer"
        >
          <QCard>
            <RouterLink
              class="fit"
              :to="{ name: 'offerCreate' }"
              :title="$t('OFFER.CREATE_TITLE')"
            >
              <QIcon
                size="5em"
                class="fit"
                name="fas fa-plus"
              />
            </RouterLink>
          </QCard>
        </div>
        <div
          v-for="offer in offers"
          :key="offer.id"
          class="col-md-4 col-sm-6 col-12"
        >
          <QCard
            class="cursor-pointer"
            :title="offer.name"
            @click="visit(offer.id)"
          >
            <QImg
              basic
              :src="offer.images[0].imageUrls.fullSize"
              :ratio="4/3"
            />
            <QItem clickable>
              <QItemSection avatar>
                <ProfilePicture
                  :user="offer.user"
                  :size="36"
                />
              </QItemSection>
              <QItemSection>
                <QitemLabel class="ellipsis full-width">
                  {{ offer.name }}
                </QitemLabel>
                <QitemLabel class="ellipsis full-width">
                  <DateAsWords
                    :date="offer.createdAt"
                    class="text-caption"
                  />
                </QItemLabel>
              </QItemSection>
            </QItem>
          </QCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { QIcon, QSelect, QCard, QItem, QItemSection, QImg } from 'quasar'
import ProfilePicture from '@/users/components/ProfilePicture'
import KSpinner from '@/utils/components/KSpinner'
import bindRoute from '@/utils/mixins/bindRoute'
import { DEFAULT_STATUS } from '@/offers/datastore/offers'
import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: {
    DateAsWords,
    ProfilePicture,
    KSpinner,
    QIcon,
    QSelect,
    QCard,
    QItem,
    QItemSection,
    QImg,
  },
  mixins: [
    bindRoute({
      status: DEFAULT_STATUS,
    }),
  ],
  data () {
    return {
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
.new-offer >>> .q-card
  height 244.483px
</style>
