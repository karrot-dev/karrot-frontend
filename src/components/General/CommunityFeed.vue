<template>
  <q-btn
    icon="fab fa-discourse fa-fw"
    :title="$t('COMMUNITY_FEED.HEADER', { community: $t('COMMUNITY_FEED.HEADER_LINK') })"
    flat
    dense
    round
    @click="showing = !showing"
  >
    <q-chip
      v-if="unreadCount > 0"
      floating
      color="red"
    >
      {{ unreadCount > 9 ? '9+' : unreadCount }}
    </q-chip>
    <component
      :is="$q.platform.is.mobile ? 'q-modal' : 'q-popover'"
      @hide="mark"
      class="k-community-feed"
      :class="$q.platform.is.mobile && 'relative-position'"
      v-model="showing"
    >
      <q-btn
        v-if="$q.platform.is.mobile"
        dense
        round
        color="secondary"
        @click="showing = false"
        style="position: absolute; right: 10px; top: 2px"
      >
        <q-icon name="fas fa-times" />
      </q-btn>
      <q-list
        link
        v-if="showing"
      >
        <q-list-header>
          <q-icon
            name="fab fa-discourse"
            size="20px"
            class="q-mr-xs"
          />
          <i18n path="COMMUNITY_FEED.HEADER">
            <a
              place="community"
              href="https://community.foodsaving.world"
              target="_blank"
              rel="noopener"
              style="text-decoration: underline"
            >
              {{ $t('COMMUNITY_FEED.HEADER_LINK') }}
            </a>
          </i18n>
        </q-list-header>
        <q-item
          v-for="topic in topics"
          :key="topic.id"
          tag="a"
          :href="topic.link"
          target="_blank"
          rel="noopener"
          :class="{ isUnread: topic.isUnread }"
        >
          <q-item-side>
            <q-item-tile avatar>
              <img
                :src="topic.originalPosterAvatar"
                :title="topic.originalPosterUsername"
              >
            </q-item-tile>
          </q-item-side>
          <q-item-main>
            <q-item-tile
              label
              lines="1"
            >
              {{ topic.title }}
            </q-item-tile>
            <q-item-tile
              sublabel
              lines="1"
            >
              <i18n
                path="COMMUNITY_FEED.LAST_UPDATED"
                tag="div"
              >
                <DateAsWords
                  place="relativeDate"
                  style="display: inline"
                  :date="topic.lastPostedAt"
                />
              </i18n>
            </q-item-tile>
          </q-item-main>
          <q-item-side
            v-if="!$q.platform.is.mobile"
            right
            stamp
          >
            <DateAsWords
              :date="topic.createdAt"
            />
          </q-item-side>
        </q-item>
      </q-list>
    </component>
  </q-btn>
</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex'
import {
  QBtn,
  QIcon,
  QPopover,
  QModal,
  QList,
  QListHeader,
  QItem,
  QItemMain,
  QItemTile,
  QItemSide,
  QChip,
} from 'quasar'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  components: {
    DateAsWords,
    QBtn,
    QIcon,
    QPopover,
    QModal,
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QChip,
  },
  data () {
    return {
      showing: false,
    }
  },
  methods: {
    ...mapActions({
      mark: 'communityFeed/mark',
    }),
  },
  computed: {
    ...mapGetters({
      unreadCount: 'communityFeed/unreadCount',
      topics: 'communityFeed/topics',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.isUnread
  background linear-gradient(to right, $lightGreen, $lighterGreen)
body.desktop .k-community-feed
  max-width 700px

</style>
