<template>
  <QItem
    :to="{name: issue.status === 'ongoing' ? 'issueChat' : 'issueVote', params: { issueId: issue.id }, query: $route.query }"
    :active="issue.id === selectedIssueId"
  >
    <QItemSection side>
      <ProfilePicture
        :user="affectedUser"
        :size="30"
        :is-link="false"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel>
        {{ affectedUser.displayName }}
      </QItemLabel>
      <QItemLabel
        caption
      >
        <DateAsWords
          :date="issue.createdAt"
          :future="false"
        />
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script setup>
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'
import { computed } from 'vue'

import { useActiveIssueService } from '@/issues/services'
import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'

const props = defineProps({
  issue: {
    required: true,
    type: Object,
  },
})

const {
  getUserById,
} = useUserService()

const { issueId: selectedIssueId } = useActiveIssueService()

const affectedUser = computed(() => getUserById(props.issue.affectedUser))
</script>
