<template>
  <div
    class="bg-white relative-position"
  >
    <KSpinner v-show="isLoading" />
    <template v-if="!isLoading">
      <QList>
        <QItem
          v-if="threads.length === 0"
        >
          {{ $t('CONVERSATION.NO_CONVERSATIONS') }}
        </QItem>
        <LatestMessageItem
          v-for="conv in threads"
          :key="conv.id"
          v-close-popup
          :thread="conv"
          :message="conv.latestMessage"
          :unread-count="conv.threadMeta.unreadReplyCount"
          :muted="conv.threadMeta.muted"
          :selected="isSelected(conv)"
          @open="openThread(conv)"
        />
        <QItem
          v-if="!asPopover && hasNextPage"
          class="row justify-center"
        >
          <QBtn
            size="sm"
            :loading="isFetchingNextPage"
            @click="() => fetchNextPage()"
          >
            {{ $t('BUTTON.SHOW_MORE') }}
          </QBtn>
        </QItem>
        <div
          v-if="asPopover"
          class="row justify-end q-my-sm q-mr-sm"
        >
          <QBtn
            v-close-popup
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

import { useStatusService } from '@/status/services'

import KSpinner from '@/utils/components/KSpinner'

import { useMyThreadsMarkSeenMutation } from '../mutations'
import { useMyThreadListQuery } from '../queries'
import { useDetailService } from '../services'

import LatestMessageItem from './LatestMessageItem'

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
  setup () {
    const {
      threads,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useMyThreadListQuery()

    const {
      openThread,
      conversation: selectedConversation,
    } = useDetailService()

    const { mutate: doMarkThreadsSeen } = useMyThreadsMarkSeenMutation()

    const { unseenThreadCount } = useStatusService()

    function markThreadsSeen () {
      if (unseenThreadCount.value <= 0) return
      doMarkThreadsSeen()
    }

    return {
      threads,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      selectedConversation,
      openThread,
      markThreadsSeen,
    }
  },
  mounted () {
    setTimeout(() => this.markThreadsSeen(), 3 * 1000)
  },
  unmounted () {
    this.markThreadsSeen()
  },
  methods: {
    isSelected (conv) {
      if (!this.selectedConversation) return false
      if (Boolean(conv.thread) !== Boolean(this.selectedConversation.thread)) return false
      return conv.id === this.selectedConversation.id
    },
  },
}
</script>
