<template>
  <DetailHeaderUI
    :conversation="conversation"
    :user="user"
    :activity="activity"
    :application="application"
    :current-user="currentUser"
    @close="() => close()"
  />
</template>

<script setup>
import { useAuthService } from '@/authuser/services'
import { useDetailService } from '@/messages/services'

import DetailHeaderUI from './DetailHeaderUI'

const {
  user: currentUser,
} = useAuthService()

const {
  conversation,
  activity,
  user,
  application,
  close,
} = useDetailService()
</script>
