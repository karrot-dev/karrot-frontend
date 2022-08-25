<template>
  <GroupPreviewUI
    :group="group"
    :is-logged-in="isLoggedIn"
    :user="user"
    :application="application"
    @withdraw="withdraw"
  />
</template>

<script setup>
import { computed, unref } from 'vue'

import { useWithdrawApplicationMutation } from '@/applications/mutations'
import { useApplicationListQuery } from '@/applications/queries'
import { useAuthService } from '@/authuser/services'
import { useActiveGroupPreviewService } from '@/groupInfo/services'
import { showToast } from '@/utils/toasts'

import GroupPreviewUI from '@/groupInfo/components/GroupPreviewUI'

const {
  userId,
  user,
  isLoggedIn,
} = useAuthService()

const {
  groupId: groupPreviewId,
  group,
} = useActiveGroupPreviewService()

const {
  mutateAsync: withdrawApplication,
} = useWithdrawApplicationMutation()

async function withdraw (id) {
  await withdrawApplication(id)
  showToast({
    message: 'JOINGROUP.APPLICATION_WITHDRAWN',
  })
}

// TODO add pending state, avoid flashing of content?
const {
  applications,
} = useApplicationListQuery({ userId, status: 'pending' }, { keepPreviousData: true })

const application = computed(() => applications.value.find(a => a.group === unref(groupPreviewId)))
</script>
