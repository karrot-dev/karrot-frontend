<template>
  <q-btn
    icon="fab fa-discourse"
    :title="$t('COMMUNITY_FEED.HEADER', { community: $t('COMMUNITY_FEED.HEADER_LINK') })"
    flat
    dense
    round
  >
    <q-chip
      v-if="unreadCount > 0"
      floating
      color="red"
    >
      {{ unreadCount }}
    </q-chip>
    <q-popover
      @hide="mark"
      style="max-width: 700px"
    >
      <q-list
        link
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
            right
            stamp
          >
            <DateAsWords
              :date="topic.createdAt"
            />
          </q-item-side>
        </q-item>
      </q-list>
    </q-popover>
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
    QList,
    QListHeader,
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QChip,
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

</style>
