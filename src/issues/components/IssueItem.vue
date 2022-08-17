<template>
  <QItem
    :to="{name: issue.status === 'ongoing' ? 'issueChat' : 'issueVote', params: { issueId: issue.id }}"
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
        />
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script setup>
import { computed } from 'vue'
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'

import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'
import { useUserService } from '@/users/services'
import { useActiveIssueService } from '@/issues/services'

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
