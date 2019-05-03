<template>
  <Component
    :is="asPage ? 'QCard' : 'div'"
    class="bg-white relative-position"
  >
    <KSpinner v-show="fetchInitialPending" />
    <template v-if="!fetchInitialPending">
      <QList no-border>
        <QItem
          v-if="conversations.length === 0"
        >
          {{ $t('CONVERSATION.NO_CONVERSATIONS') }}
        </QItem>
        <LatestMessageItem
          v-for="conv in conversations"
          :key="'conv' + conv.id"
          v-close-overlay
          :group="conv.type === 'group' ? conv.target : null"
          :user="conv.type === 'private' ? conv.target : null"
          :pickup="conv.type === 'pickup' ? conv.target : null"
          :place="conv.type === 'place' ? conv.target : null"
          :application="conv.type === 'application' ? conv.target : null"
          :issue="conv.type === 'issue' ? conv.target : null"
          :message="conv.latestMessage"
          :unread-count="conv.unreadMessageCount"
          :muted="conv.muted"
          :closed="conv.isClosed"
          :selected="isSelected(conv)"
          @open="open(conv)"
        />
        <QItem
          v-if="!asPopover && canFetchPastConversations"
          class="row justify-center"
        >
          <QBtn
            size="sm"
            :loading="fetchingPastConversations"
            @click="fetchPastConversations"
          >
            {{ $t('BUTTON.SHOW_MORE') }}
          </QBtn>
        </QItem>
      </QList>
      <QList
        v-if="threads.length > 0"
        no-border
      >
        <QItemSeparator />
        <QListHeader>
          {{ $t('CONVERSATION.REPLIES') }}
        </QListHeader>
        <LatestMessageItem
          v-for="conv in threads"
          :key="'thread' + conv.id"
          :thread="conv"
          :message="conv.latestMessage"
          :unread-count="conv.threadMeta.unreadReplyCount"
          :muted="conv.threadMeta.muted"
          :selected="isSelected(conv)"
          @open="openForThread(conv)"
        />
        <QItem
          v-if="!asPopover && canFetchPastThreads"
          class="row justify-center"
        >
          <QBtn
            size="sm"
            :loading="fetchingPastThreads"
            @click="fetchPastThreads"
          >
            {{ $t('BUTTON.SHOW_MORE') }}
          </QBtn>
        </QItem>
        <div
          v-if="asPopover"
          class="row justify-end q-mt-sm q-mr-sm"
        >
          <QBtn
            v-close-overlay
            size="sm"
            color="secondary"
            :to="{ name: 'messages' }"
          >
            {{ $t('BUTTON.SHOW_MORE') }}
          </QBtn>
        </div>
      </QList>
    </template>
  </Component>
</template>

<script>
import {
  QCard,
  QList,
  QListHeader,
  QItemSeparator,
  QItem,
  QBtn,
} from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import LatestMessageItem from './LatestMessageItem'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    QCard,
    QList,
    QListHeader,
    QItemSeparator,
    QItem,
    QBtn,
    LatestMessageItem,
    KSpinner,
  },
  props: {
    asPage: {
      type: Boolean,
      default: false,
    },
    asPopover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      conversations: 'latestMessages/conversations',
      canFetchPastConversations: 'latestMessages/canFetchPastConversations',
      fetchingPastConversations: 'latestMessages/fetchingPastConversations',
      threads: 'latestMessages/threads',
      canFetchPastThreads: 'latestMessages/canFetchPastThreads',
      fetchingPastThreads: 'latestMessages/fetchingPastThreads',
      fetchInitialPending: 'latestMessages/fetchInitialPending',
      selectedConversation: 'detail/conversation',
    }),
  },
  mounted () {
    this.fetchInitial()
    this.markAllSeen()
  },
  methods: {
    ...mapActions({
      openForPickup: 'detail/openForPickup',
      openForUser: 'detail/openForUser',
      openForThread: 'detail/openForThread',
      openForApplication: 'detail/openForApplication',
      fetchPastConversations: 'latestMessages/fetchPastConversations',
      fetchPastThreads: 'latestMessages/fetchPastThreads',
      fetchInitial: 'latestMessages/fetchInitial',
      markAllSeen: 'latestMessages/markAllSeen',
    }),
    open (conv) {
      const { type, target } = conv
      switch (type) {
        case 'group': return this.$router.push({ name: 'group', params: { groupId: target.id } })
        case 'place': return this.$router.push({ name: 'placeWall', params: { groupId: target.group.id, placeId: target.id } })
        case 'pickup': return this.openForPickup(target)
        case 'private': return this.openForUser(target)
        case 'application': return this.openForApplication(target)
        case 'issue': return this.$router.push({ name: 'issueChat', params: { groupId: target.group.id, issueId: target.id } })
      }
    },
    isSelected (conv) {
      if (!this.selectedConversation) return false
      if (Boolean(conv.thread) !== Boolean(this.selectedConversation.thread)) return false
      return conv.id === this.selectedConversation.id
    },
  },
}
</script>
