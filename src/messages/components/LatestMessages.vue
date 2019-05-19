<template>
  <div>
    <QTabs
      v-model="selected"
      inverted
      class="k-message-tabs"
    >
      <Component
        :is="asPage ? 'QRouteTab' : 'QTab'"
        slot="title"
        name="conversations"
        :to="{ name: 'latestConversations' }"
        :label="$t('CONVERSATION.CONVERSATIONS')"
        :count="unseenConversationsCount > 9 ? '9+' : unseenConversationsCount"
      />
      <Component
        :is="asPage ? 'QRouteTab' : 'QTab'"
        slot="title"
        name="threads"
        :to="{ name: 'latestThreads' }"
        :label="$t('CONVERSATION.REPLIES')"
        :count="unseenThreadsCount > 9 ? '9+' : unseenThreadsCount"
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
    }),
    hasOnlyUnseenThreads () {
      return Boolean(this.unseenThreadsCount && !this.unseenConversationsCount)
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
