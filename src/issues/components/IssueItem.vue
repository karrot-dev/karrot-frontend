<template>
  <QItem
    link
    :to="{name: issue.isOngoing ? 'issueChat' : 'issueVote', params: { issueId: issue.id }}"
    :class="{'router-link-active': issue.isSelected}"
  >
    <QItemSection side>
      <ProfilePicture
        :user="issue.affectedUser"
        :size="30"
        :is-link="false"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel
        header
      >
        {{ issue.affectedUser.displayName }}
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

<script>
import {
  QItem,
  QItemSection,
  QItemSection
  QItemLabel,
} from 'quasar'

import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: {
    QItem,
    QItemSection,
    QItemSection
    QItemLabel,
    ProfilePicture,
    DateAsWords,
  },
  props: {
    issue: {
      required: true,
      type: Object,
    },
  },
}
</script>
