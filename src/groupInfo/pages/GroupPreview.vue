<template>
  <GroupPreviewUI
    :group="$store.getters['groups/activePreview']"
    :is-logged-in="$store.getters['auth/isLoggedIn']"
    :user="$store.getters['auth/user']"
    :application="application"
    @withdraw="withdraw"
  />
</template>

<script setup>
import { computed, unref } from 'vue'
import GroupPreviewUI from '@/groupInfo/components/GroupPreviewUI'
import { useIntegerRouteParam } from '@/utils/composables'
import { useWithdrawApplicationMutation } from '@/applications/mutations'
import { useApplicationListQuery } from '@/applications/queries'
import { useAuthService } from '@/authuser/services'
import { useQueryClient } from 'vue-query'
import { showToast } from '@/utils/toasts'

const { userId } = useAuthService()

const groupPreviewId = useIntegerRouteParam('groupPreviewId')

const {
  mutate: withdrawApplication,
} = useWithdrawApplicationMutation()

const queryClient = useQueryClient()

const withdraw = id => {
  withdrawApplication(id, {
    onSuccess () {
      showToast({
        message: 'JOINGROUP.APPLICATION_WITHDRAWN',
      })
      queryClient.invalidateQueries(['applications'])
    },
  })
}

// TODO add pending state, avoid flashing of content?
const {
  applications,
} = useApplicationListQuery({ userId, status: 'pending' }, { keepPreviousData: true })

const application = computed(() => applications.value.find(a => a.group === unref(groupPreviewId)))
</script>
