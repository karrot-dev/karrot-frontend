<template>
  <DetailUI
    :user="user"
    :activity="activity"
    :application="application"
    :conversation="conversation"
    :messages="messages"
    :order="order"
    :pending="isLoadingConversation || isLoadingMessages"
    :away="isAway"
    :has-next-page="hasNextPage"
    :is-fetching-next-page="isFetchingNextPage"
    :fetch-next-page="fetchNextPage"
  />
</template>

<script setup>
import { usePresenceService } from '@/base/services/presence'
import { useDetailService } from '@/messages/services'

import DetailUI from './DetailUI'

const { isAway } = usePresenceService()

const {
  conversation,
  messages,
  order,
  isLoadingConversation,
  isLoadingMessages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  activity,
  user,
  application,
} = useDetailService()
</script>
