<template>
  <div
    class="bg-white"
  >
    <KSpinner v-show="isLoading" />
    <QList>
      <QItem
        v-if="!isLoading && notifications.length === 0"
      >
        {{ $t('NOTIFICATION_BELLS_LIST.NO_ITEMS') }}
      </QItem>
      <NotificationItem
        v-for="notification in notifications"
        :key="notification.id"
        v-close-popup
        :notification="notification"
        @click="() => maybeMarkClickedAndSeen(notification)"
      />
      <div
        v-if="asPopover"
        class="row justify-end q-my-sm q-mr-sm"
      >
        <QBtn
          v-close-popup
          size="sm"
          color="secondary"
          :to="{ name: 'notifications' }"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </QBtn>
      </div>
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
    </QList>
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QBtn,
} from 'quasar'
import NotificationItem from './NotificationItem'
import KSpinner from '@/utils/components/KSpinner'
import { useNotificationListQuery } from '../queries'
import { useMarkClickedMutation, useMarkSeenMutation } from '../mutations'

export default {
  components: {
    QList,
    QItem,
    QBtn,
    NotificationItem,
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
  setup () {
    const {
      notifications,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useNotificationListQuery()

    const {
      mutate: markClicked,
    } = useMarkClickedMutation()

    const {
      mutate: markSeen,
      isIdle,
    } = useMarkSeenMutation()

    function maybeMarkClickedAndSeen (notification) {
      if (!notification.clicked) markClicked(notification.id)
      if (isIdle) markSeen()
    }

    return {
      notifications,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      maybeMarkClickedAndSeen,
    }
  },
  mounted () {
    this.setPageVisible(true)
  },
  beforeUnmount () {
    this.setPageVisible(false)
  },
}
</script>
