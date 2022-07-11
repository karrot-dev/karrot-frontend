<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<template>
  <QItem
    :to="{name: issue.isOngoing ? 'issueChat' : 'issueVote', params: { issueId: issue.id }}"
    :active="issue.isSelected"
  >
    <QItemSection side>
      <ProfilePicture
        :user="issue.affectedUser"
        :size="30"
        :is-link="false"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel>
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
  QItemLabel,
} from 'quasar'

import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: {
    QItem,
    QItemSection,
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
