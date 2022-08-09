<template>
  <DetailHeaderUI
    :user="$store.getters['detail/user']"
    :activity="activity"
    :application="$store.getters['detail/application']"
    :conversation="conversation"
    :current-user="currentUser"
    @save-conversation="data => $store.dispatch('conversations/maybeSave', data)"
    @close="() => close()"
  />
</template>

<script setup>
import DetailHeaderUI from './DetailHeaderUI'
import { useDetailService } from '@/messages/services'
import { useAuthService } from '@/authuser/services'

const {
  user: currentUser,
} = useAuthService()

const {
  conversation,
  activity,
  close,
} = useDetailService()
</script>
