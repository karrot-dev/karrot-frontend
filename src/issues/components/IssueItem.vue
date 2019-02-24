<template>
  <QItem
    link
    :to="{name: 'issueDetail', params: { issueId: issue.id }}"
  >
    <QItemSide>
      <ProfilePicture
        :user="issue.affectedUser"
        :size="30"
        :is-link="false"
      />
    </QItemSide>
    <QItemMain>
      <QItemTile
        label
      >
        {{ issue.affectedUser.displayName }}
      </QItemTile>
      <QItemTile
        sublabel
      >
        {{ submittedOn }}
      </QItemTile>
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

export default {
  components: {
    QItem,
    QItemMain,
    QItemSide,
    QItemTile,
    ProfilePicture,
  },
  props: {
    issue: {
      required: true,
      type: Object,
    },
  },
  computed: {
    submittedOn () {
      const date = this.$d(this.issue.createdAt, 'long')
      return this.$t('ISSUE.SUBMITTED_ON', { date: date })
    },
  },
}
</script>
