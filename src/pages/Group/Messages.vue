<template>
  <component
    :is="$q.platform.is.mobile ? 'div' : 'q-card'"
    class="bg-white k-messages"
  >
    <q-list>
      <MessageItem
        v-for="conv in conversations"
        :key="'conv' + conv.id"
        :user="conv.type === 'private' ? conv.target : null"
        :pickup="conv.type === 'pickup' ? conv.target : null"
        :application="conv.type === 'application' ? conv.target : null"
        :message="conv.latestMessage"
        :unread-count="conv.unreadMessageCount"
        @open="open(conv)"
      />
      <q-item
        v-if="canFetchPastConversations"
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
    <q-list>
      <q-item-separator />
      <q-list-header>
        {{ $t('CONVERSATION.REPLIES') }}
      </q-list-header>
      <MessageItem
        v-for="conv in threads"
        :key="'thread' + conv.id"
        :thread="conv"
        :message="conv.latestMessage"
        :unread-count="conv.threadMeta.unreadReplyCount"
        @open="openForThread(conv)"
      />
      <q-item
        v-if="canFetchPastThreads"
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
import MessageItem from './MessageItem'

export default {
  components: {
    QCard,
    QList,
    QListHeader,
    QItemSeparator,
    QItem,
    QBtn,
    MessageItem,
  },
  computed: {
    ...mapGetters({
      conversations: 'latestMessages/conversations',
      canFetchPastConversations: 'latestMessages/canFetchPastConversations',
      fetchingPastConversations: 'latestMessages/fetchingPastConversations',
      threads: 'latestMessages/threads',
      canFetchPastThreads: 'latestMessages/canFetchPastThreads',
      fetchingPastThreads: 'latestMessages/fetchingPastThreads',
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
        case 'pickup': return this.openForPickup(target)
        case 'private': return this.openForUser(target)
        case 'application': return this.openForApplication(target)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
.k-messages
  max-width 500px
  margin-left auto
  margin-right auto
</style>
