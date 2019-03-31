<template>
  <QBtn
    :title="$t('COMMUNITY_FEED.HEADER', { community: $t('COMMUNITY_FEED.HEADER_LINK') })"
    flat
    dense
    round
    @click="showing = !showing"
  >
    <QIcon
      name="fab fa-discourse fa-fw"
      :class="{ hasUnread: unreadCount > 0 }"
    />
    <QChip
      v-if="unreadCount > 0"
      floating
      color="red"
    >
      {{ unreadCount > 9 ? '9+' : unreadCount }}
    </QChip>
    <Component
      :is="$q.platform.is.mobile ? 'QModal' : 'QPopover'"
      v-model="showing"
      class="k-community-feed"
      :class="$q.platform.is.mobile && 'relative-position'"
      @hide="mark"
    >
      <QBtn
        v-if="$q.platform.is.mobile"
        dense
        round
        color="secondary"
        style="position: absolute; right: 10px; top: 2px"
        @click="showing = false"
      >
        <QIcon name="fas fa-times" />
      </QBtn>
      <QList
        v-if="showing"
        link
      >
        <QListHeader>
          <QIcon
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
        </QListHeader>
        <QItem
          v-for="topic in topics"
          :key="topic.id"
          tag="a"
          :href="topic.link"
          target="_blank"
          rel="noopener"
          :class="{ isUnread: topic.isUnread }"
        >
          <QItemSide>
            <QItemTile avatar>
              <img
                :src="topic.lastPosterAvatar"
                :title="topic.lastPosterUsername"
              >
            </QItemTile>
          </QItemSide>
          <QItemMain>
            <QItemTile
              label
              lines="1"
            >
              {{ topic.title }}
            </QItemTile>
            <QItemTile
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
            </QItemTile>
          </QItemMain>
        </QItem>
      </QList>
    </Component>
  </QBtn>
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
import DateAsWords from '@/utils/components/DateAsWords'

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
  computed: {
    ...mapGetters({
      unreadCount: 'communityFeed/unreadCount',
      topics: 'communityFeed/topics',
    }),
  },
  methods: {
    ...mapActions({
      mark: 'communityFeed/mark',
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
.q-icon:not(.hasUnread)
  opacity $topbar-opacity-low
.q-btn:hover .q-icon
  opacity 1
</style>
