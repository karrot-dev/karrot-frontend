<template>
  <DetailHeaderUI
    :conversation="conversation"
    :user="user"
    :activity="activity"
    :application="$store.getters['detail/application']"
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
  user,
  close,
} = useDetailService()
</script>
