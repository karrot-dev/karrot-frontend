<template>
  <QItem
    link
    @click.native="open"
  >
    <QItemSide>
      <ProfilePicture
        :user="issue.affectedUser.displayName"
        :size="30"
        :is-link="false"
      />
    </QItemSide>
    <QItemMain>
      <QItemTile
        label
      >
        {{ this.issue.id }}
      </QItemTile>
      <QItemTile
        sublabel
      >
        {{ this.issue.createdAt }}
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
  methods: {
    open () {
      console.log('In the Item: ', this.issue.id)
      this.$emit('open', this.issue)
    },
  },
}
</script>
