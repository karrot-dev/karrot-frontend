<template>
  <component
    :is="asPage ? 'q-card' : 'div'"
    class="bg-white"
  >
    <q-list no-border>
      <div
        v-if="hideLoadMore"
        class="row justify-end q-mb-sm q-mr-sm"
      >
        <q-btn
          v-close-overlay
          size="sm"
          color="secondary"
          :to="{ name: 'messages' }"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </q-btn>
      </div>
      <q-item
        v-if="conversations.length === 0"
      >
        {{ $t('CONVERSATION.NO_CONVERSATIONS') }}
      </q-item>
      <LatestMessageItem
        v-for="conv in conversations"
        :key="'conv' + conv.id"
        :group="conv.type === 'group' ? conv.target : null"
        :user="conv.type === 'private' ? conv.target : null"
        :pickup="conv.type === 'pickup' ? conv.target : null"
        :application="conv.type === 'application' ? conv.target : null"
        :message="conv.latestMessage"
        :unread-count="conv.unreadMessageCount"
        :muted="!conv.emailNotifications"
        :selected="isSelected(conv)"
        @open="open(conv)"
      />
      <q-item
        v-if="!hideLoadMore && canFetchPastConversations"
        class="row justify-center"
      >
        <q-btn
          size="sm"
          :loading="fetchingPastConversations"
          @click="fetchPastConversations"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </q-btn>
      </q-item>
    </q-list>
    <q-list
      v-if="threads.length > 0"
      no-border
    >
      <q-item-separator />
      <q-list-header>
        {{ $t('CONVERSATION.REPLIES') }}
      </q-list-header>
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
      <q-item
        v-if="!hideLoadMore && canFetchPastThreads"
        class="row justify-center"
      >
        <q-btn
          size="sm"
          :loading="fetchingPastThreads"
          @click="fetchPastThreads"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </q-btn>
      </q-item>
    </q-list>

  </component>
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

export default {
  components: {
    QCard,
    QList,
    QListHeader,
    QItemSeparator,
    QItem,
    QBtn,
    LatestMessageItem,
  },
  props: {
    asPage: {
      type: Boolean,
      default: false,
    },
    hideLoadMore: {
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
      selectedConversation: 'detail/conversation',
    }),
  },
  methods: {
    ...mapActions({
      openForPickup: 'detail/openForPickup',
      openForUser: 'detail/openForUser',
      openForThread: 'detail/openForThread',
      openForApplication: 'detail/openForApplication',
      fetchPastConversations: 'latestMessages/fetchPastConversations',
      fetchPastThreads: 'latestMessages/fetchPastThreads',
    }),
    open (conv) {
      const { type, target } = conv
      switch (type) {
        case 'group': return this.$router.push({ name: 'group', params: { groupId: target.id } })
        case 'pickup': return this.openForPickup(target)
        case 'private': return this.openForUser(target)
        case 'application': return this.openForApplication(target)
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
