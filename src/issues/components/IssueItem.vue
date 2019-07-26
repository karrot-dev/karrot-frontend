<template>
  <QItem
    link
    :to="{name: issue.isOngoing ? 'issueChat' : 'issueVote', params: { issueId: issue.id }}"
    :class="{'router-link-active': issue.isSelected}"
  >
    <QItemSide>
      <ProfilePicture
        :user="issue.affectedUser"
        :size="30"
        :is-link="false"
      />
    </QItemSide>
    <QItemMain>
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
    </QItemMain>
  </QItem>
</template>

<script>
import {
  QItem,
  QItemMain,
  QItemSide,
  QItemTile,
} from 'quasar'

import ProfilePicture from '@/users/components/ProfilePicture'
import DateAsWords from '@/utils/components/DateAsWords'

export default {
  components: {
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
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
