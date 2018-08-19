<template>
  <component
    :is="$q.platform.is.mobile ? 'div' : 'q-card'"
    class="bg-white"
  >
    <q-list>
      <MessageItem
        v-for="conv in both"
        :key="(conv.threadMeta ? 'thread' : 'conv') + conv.id"
        :user="conv.type === 'private' ? conv.target : null"
        :pickup="conv.type === 'pickup' ? conv.target : null"
        :thread="conv.threadMeta ? conv : null"
        :message="conv.latestMessage"
        :unread-count="conv.threadMeta ? conv.threadMeta.unreadReplyCount : conv.unreadMessageCount"
        @open="conv.threadMeta ? openForThread(conv) : open(conv)"
      />
    </q-list>
  </component>
</template>

<script>
import {
  QCard,
  QList,
} from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import MessageItem from './MessageItem'

export default {
  components: {
    QCard,
    QList,
    MessageItem,
  },
  computed: {
    ...mapGetters({
      conversations: 'conversations/latest',
      threads: 'conversations/latestThreads',
    }),
    both () {
      return [
        ...this.conversations,
        ...this.threads,
      ].sort((a, b) => b.latestMessage.createdAt - a.latestMessage.createdAt)
    },
  },
  methods: {
    ...mapActions({
      openForPickup: 'detail/openForPickup',
      openForUser: 'detail/openForUser',
      openForThread: 'detail/openForThread',
    }),
    open (conv) {
      const { type, target } = conv
      if (type === 'pickup') return this.openForPickup(target)
      if (type === 'private') return this.openForUser(target)
    },
  },
}
</script>
