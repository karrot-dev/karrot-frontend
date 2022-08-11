<template>
  <DetailUI
    :user="user"
    :activity="activity"
    :application="application"
    :conversation="conversation"
    :messages="messages"
    :order="order"
    :pending="isLoadingConversation || isLoadingMessages"
    :away="$store.getters['presence/toggle/away']"
    :has-next-page="hasNextPage"
    :is-fetching-next-page="isFetchingNextPage"
    :fetch-next-page="fetchNextPage"
  />
</template>

<script setup>
import DetailUI from './DetailUI'
import { useDetailService } from '@/messages/services'

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
