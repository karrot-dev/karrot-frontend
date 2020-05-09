<template>
  <div class="bg-white">
    <div class="flex">
      <QTabs
        v-model="selected"
        class="k-message-tabs col-grow"
        align="left"
      >
        <Component
          :is="asPage ? 'QRouteTab' : 'QTab'"
          name="conversations"
          :to="{ name: 'latestConversations' }"
          :label="$t('CONVERSATION.CONVERSATIONS')"
          :count="unseenConversationCount > 9 ? '9+' : unseenConversationCount"
        />
        <Component
          :is="asPage ? 'QRouteTab' : 'QTab'"
          name="threads"
          :to="{ name: 'latestThreads' }"
          :label="$t('CONVERSATION.REPLIES')"
          :count="unseenThreadCount > 9 ? '9+' : unseenThreadCount"
        />
      </QTabs>
      <QBtn
        flat
        round
        icon="fas fa-cog"
        :title="$t('SETTINGS.TITLE')"
        :to="{ name: 'settings', hash: '#notifications' }"
      />
    </div>
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
  QBtn,
  QTabs,
  QTab,
  QRouteTab,
} from 'quasar'
import LatestConversations from './LatestConversations'
import LatestThreads from './LatestThreads'

export default {
  components: {
    QBtn,
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
      unseenConversationCount: 'status/unseenConversationCount',
      unseenThreadCount: 'status/unseenThreadCount',
      hasUnread: 'status/hasUnreadMessagesOrThreads',
    }),
    hasOnlyUnseenThreads () {
      return Boolean(this.unseenThreadCount > 0 && this.unseenConversationCount === 0)
    },
  },
  mounted () {
    if (this.hasOnlyUnseenThreads) {
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
