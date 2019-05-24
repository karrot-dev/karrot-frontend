<template>
  <div
    class="bg-white relative-position"
  >
    <KSpinner v-show="fetchInitialPending" />
    <template v-if="!fetchInitialPending">
      <QList
        no-border
      >
        <QItem
          v-if="threads.length === 0"
        >
          {{ $t('CONVERSATION.NO_CONVERSATIONS') }}
        </QItem>
        <LatestMessageItem
          v-for="conv in threads"
          :key="conv.id"
          v-close-overlay
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
            :to="{ name: 'latestThreads' }"
          >
            {{ $t('BUTTON.SHOW_MORE') }}
          </QBtn>
        </div>
      </QList>
    </template>
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QBtn,
} from 'quasar'
import { mapGetters, mapActions } from 'vuex'
import LatestMessageItem from './LatestMessageItem'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    QList,
    QItem,
    QBtn,
    LatestMessageItem,
    KSpinner,
  },
  props: {
    asPopover: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      threads: 'latestMessages/threads',
      canFetchPastThreads: 'latestMessages/canFetchPastThreads',
      fetchingPastThreads: 'latestMessages/fetchingPastThreads',
      fetchInitialPending: 'latestMessages/fetchInitialPending',
      selectedConversation: 'detail/conversation',
    }),
  },
  mounted () {
    this.fetchInitial()
    setTimeout(() => this.markThreadsSeen(), 3 * 1000)
  },
  destroyed () {
    this.markThreadsSeen()
  },
  methods: {
    ...mapActions({
      openForThread: 'detail/openForThread',
      fetchPastThreads: 'latestMessages/fetchPastThreads',
      fetchInitial: 'latestMessages/fetchInitial',
      markThreadsSeen: 'latestMessages/markThreadsSeen',
    }),
    isSelected (conv) {
      if (!this.selectedConversation) return false
      if (Boolean(conv.thread) !== Boolean(this.selectedConversation.thread)) return false
      return conv.id === this.selectedConversation.id
    },
  },
}
</script>
