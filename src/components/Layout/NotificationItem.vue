<template>
  <q-item
    link
    :class="{ isUnread: !notification.clicked }"
    @click.native="$emit('open', notification)"
  >
    <q-item-main>
      <q-item-tile
        label
      >
        {{ notificationText }}
      </q-item-tile>
      <q-item-tile
        sublabel
      >
        {{ notification.type }}, {{ notification.context }}
      </q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
import {
  QItem,
  QItemMain,
  QItemTile,
  QItemSide,
  QChip,
  QIcon,
} from 'quasar'
import DateAsWords from '@/components/General/DateAsWords'

export default {
  components: {
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QChip,
    QIcon,
    DateAsWords,
  },
  props: {
    notification: {
      type: Object,
      default: null,
    },
  },
  computed: {
    notificationText () {
      switch (this.notification.type) {
        case 'new_applicant':
          return this.notification.application &&
            this.$t('NOTIFICATIONS.BELLS.NEW_APPLICANT', {
              userName: this.notification.application.user.displayName,
              groupName: this.notification.application.group.name,
            })
        case 'user_became_editor':
          return this.$t('NOTIFICATIONS.BELLS.YOU_BECAME_EDITOR', {
            groupName: this.notification.group.name,
          })
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.isUnread
  background linear-gradient(to right, $lightGreen, $lighterGreen)
  &:hover
    background alpha($grey, 0.5)
</style>
