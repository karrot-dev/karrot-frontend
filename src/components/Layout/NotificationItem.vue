<template>
  <q-item
    link
    :class="{ isUnread: !notification.clicked }"
    @click.native="$emit('open', notification)"
  >
    <q-item-side v-if="user">
      <ProfilePicture
        :user="user"
        :size="$q.platform.is.mobile ? 35 : 40"
      />
    </q-item-side>
    <q-item-main>
      <q-item-tile
        label
      >
        {{ message }}
      </q-item-tile>
      <q-item-tile
        sublabel
      >
        <DateAsWords
          :date="notification.createdAt"
          style="display: inline"
        />
        · {{ groupName }}
        <template v-if="context && context.pickup">
          · {{ notification.context.pickup.store.name }}
        </template>
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
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'

export default {
  components: {
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
    QChip,
    QIcon,
    DateAsWords,
    ProfilePicture,
  },
  props: {
    notification: {
      type: Object,
      default: null,
    },
  },
  computed: {
    context () {
      return this.notification && this.notification.context
    },
    user () {
      if (!this.context) return

      // new_store is not about the user, but the store
      if (this.notification.type === 'new_store') return
      return this.context.user
    },
    groupName () {
      if (!this.context) return
      return this.context.group && this.context.group.name
    },
    message () {
      if (!this.notification) return
      const { type } = this.notification
      if (!type) return

      return this.$t(`NOTIFICATION_BELLS.${type.toUpperCase()}`, this.messageParams)
    },
    messageParams () {
      if (!this.context) return
      const { context, type } = this.notification

      const commonParams = {
        userName: context.user && context.user.displayName,
      }

      switch (type) {
        case 'new_applicant':
          return {
            userName: context.application && context.application.user.displayName,
          }
        case 'feedback_possible':
          return {
            date: context.pickup && this.$d(context.pickup.date, 'dayAndTime'),
          }
        case 'new_store':
          return {
            storeName: context.store.name,
          }
      }

      return commonParams
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
