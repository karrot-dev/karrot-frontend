<template>
  <div class="bg-white">
    <QTabs
      v-model="selected"
      class="k-message-tabs"
      align="left"
    >
      <Component
        :is="asPage ? 'QRouteTab' : 'QTab'"
        name="conversations"
        :to="{ name: 'latestConversations' }"
        :label="$t('CONVERSATION.CONVERSATIONS')"
        :count="unseenConversationsCount > 9 ? '9+' : unseenConversationsCount"
      />
      <Component
        :is="asPage ? 'QRouteTab' : 'QTab'"
        name="threads"
        :to="{ name: 'latestThreads' }"
        :label="$t('CONVERSATION.REPLIES')"
        :count="unseenThreadsCount > 9 ? '9+' : unseenThreadsCount"
      />
      <QRouteTab
        :title="$t('SETTINGS.TITLE')"
        icon="fas fa-cog"
        :to="{ name: 'settings', hash: '#notifications' }"
      />
    </QTabs>
    <RouterView
      v-if="asPage"
    />
    <template
      v-else
    >
      <LatestConversations
        v-if="selected === 'conversations'"
        as-popover
      />
      <LatestThreads
        v-if="selected === 'threads'"
        as-popover
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import {
  QTabs,
  QTab,
  QRouteTab,
} from 'quasar'
import LatestConversations from './LatestConversations'
import LatestThreads from './LatestThreads'

export default {
  components: {
    QTabs,
    QTab,
    QRouteTab,
    LatestConversations,
    LatestThreads,
  },
  props: {
    asPage: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      selected: 'conversations',
    }
  },
  computed: {
    ...mapGetters({
      unseenConversationsCount: 'latestMessages/unseenConversationsCount',
      unseenThreadsCount: 'latestMessages/unseenThreadsCount',
      unread: 'latestMessages/unread',
    }),
    hasOnlyUnseenThreads () {
      return Boolean(this.unseenThreadsCount && !this.unseenConversationsCount)
    },
    hasOnlyUnreadThreads () {
      return Boolean(!this.unread.conversations.length && this.unread.threads.length)
    },
  },
  mounted () {
    if (this.hasOnlyUnseenThreads || this.hasOnlyUnreadThreads) {
      this.selected = 'threads'
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~variables'

.k-message-tabs >>> .q-tab .q-chip
  background alpha($secondary, 0.85)
</style>
