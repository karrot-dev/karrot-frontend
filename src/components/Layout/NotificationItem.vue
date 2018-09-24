<template>
  <q-item
    link
    :class="{ isUnread: !notification.clicked }"
    @click.native="$emit('click', notification)"
    :to="routeTo"
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
        <q-icon
          v-if="icon"
          :name="icon"
          class="q-mr-xs vertical-baseline"
        />
        {{ message }}
      </q-item-tile>
      <q-item-tile
        sublabel
      >
        <DateAsWords
          :date="showExpiresAt ? notification.expiresAt : notification.createdAt"
          style="display: inline"
          :allow-future="showExpiresAt"
        />
        · {{ groupName }}
        <template v-if="storeName">
          · {{ storeName }}
        </template>
      </q-item-tile>
    </q-item-main>
  </q-item>
</template>

<script>
import notificationConfig from './notificationConfig'
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
    type () {
      return this.notification && this.notification.type
    },
    config () {
      if (!this.type || !this.context) return
      return notificationConfig(this.type, this.context)
    },
    user () {
      if (!this.context) return
      if (!this.context.user) return

      // it shouldn't be needed to show your own picture
      if (this.context.user.isCurrentUser) return

      // new_store is not about the user, but the store
      if (this.type === 'new_store') return

      return this.context.user
    },
    groupName () {
      if (!this.context) return
      return this.context.group && this.context.group.name
    },
    storeName () {
      if (!this.context) return
      if (this.context.pickup) {
        return this.context.pickup.store.name
      }
    },
    message () {
      if (!this.config) return
      return this.config.message
    },
    icon () {
      if (!this.config) return
      return this.config.icon
    },
    routeTo () {
      if (!this.config) return
      return this.config.routeTo
    },
    showExpiresAt () {
      return this.type === 'pickup_upcoming'
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
