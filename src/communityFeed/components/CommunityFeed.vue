<template>
  <QItem
    @click.native="showing = !showing"
  >
    <QItemSection
      side
      class="text-center"
    >
      <QIcon
        name="fab fa-discourse fa-fw"
      />
    </QItemSection>
    <QItemSection>
      {{ $t('COMMUNITY_FEED.KARROT_DISCUSSION') }}
    </QItemSection>
    <QItemSection
      v-if="unreadCount > 0"
      side
    >
      <QChip
        small
        color="secondary"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </QChip>
    </QItemSection>
    <QDialog
      v-model="showing"
      class="k-community-feed relative-position"
      @hide="mark"
    >
      <QBtn
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
      >
        <QItemLabel header>
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
        </QItemLabel>
        <QItem
          v-for="topic in topics"
          :key="topic.id"
          tag="a"
          :href="topic.link"
          target="_blank"
          rel="noopener"
          :class="{ isUnread: topic.isUnread }"
        >
          <QItemSection side>
            <QItemTile avatar>
              <img
                :src="topic.lastPosterAvatar"
                :title="topic.lastPosterUsername"
              >
            </QItemTile>
          </QItemSection>
          <QItemSection>
            <QItemLabel
              lines="1"
            >
              {{ topic.title }}
            </QItemLabel>
            <QItemLabel
              caption
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
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
    </QDialog>
  </QItem>
</template>

<script>
import {
  mapActions,
  mapGetters,
} from 'vuex'
import {
  QBtn,
  QIcon,
  QDialog,
  QList,
  QItemLabel,
  QItem,
  QItemSection,
  QChip,
} from 'quasar'
import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: {
    DateAsWords,
    QBtn,
    QIcon,
    QDialog,
    QList,
    QItemLabel,
    QItem,
    QItemSection,
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
</style>
