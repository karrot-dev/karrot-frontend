<template>
  <GroupPreviewUI
    :group="group"
    :is-logged-in="isLoggedIn"
    :user="user"
    :application="application"
    :public-activities="publicActivities"
    @withdraw="withdraw"
  />
</template>

<script setup>
import { computed, unref } from 'vue'

import { usePublicActivityListQuery } from '@/activities/queries'
import { useWithdrawApplicationMutation } from '@/applications/mutations'
import { useApplicationListQuery } from '@/applications/queries'
import { useAuthService } from '@/authuser/services'
import { useActiveGroupPreviewService } from '@/groupInfo/services'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'
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

const {
  publicActivities,
} = usePublicActivityListQuery({
  groupId: groupPreviewId,
  dateMin: newDateRoundedTo5Minutes(),
})

// TODO add pending state, avoid flashing of content?
const {
  applications,
} = useApplicationListQuery({ userId, status: 'pending', isLoggedIn }, { keepPreviousData: true })

const application = computed(() => applications.value.find(a => a.group === unref(groupPreviewId)))
</script>
