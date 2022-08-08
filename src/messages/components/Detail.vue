<template>
  <DetailUI
    :user="$store.getters['detail/user']"
    :activity="$store.getters['detail/activity']"
    :application="$store.getters['detail/application']"
    :conversation="conversation"
    :messages="messages"
    :pending="isLoadingConversation || isLoadingMessages"
    :away="$store.getters['presence/toggle/away']"
    :current-user="$store.getters['auth/user']"
    :has-next-page="hasNextPage"
    :has-previous-page="hasPreviousPage"
    :is-fetching-next-page="isFetchingNextPage"
    :is-fetching-previous-page="isFetchingPreviousPage"
    :fetch-next-page="fetchNextPage"
    :fetch-previous-page="fetchPreviousPage"
    @application-accept="data => $store.dispatch('applications/accept', data)"
    @application-decline="data => $store.dispatch('applications/decline', data)"
  />
</template>

<script setup>
import DetailUI from './DetailUI'
import { useDetailService } from '@/messages/services'

const {
  conversation,
  messages,
  isLoadingConversation,
  isLoadingMessages,
  hasNextPage,
  hasPreviousPage,
  isFetchingNextPage,
  isFetchingPreviousPage,
  fetchNextPage,
  fetchPreviousPage,
} = useDetailService()
</script>
