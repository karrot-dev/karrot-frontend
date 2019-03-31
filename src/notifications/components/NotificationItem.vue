<template>
  <QItem
    link
    :class="{ isUnread: !notification.clicked }"
    active-class="ignore-active-link"
    :to="routeTo"
    @click.native="$emit('click', notification)"
  >
    <QItemSide v-if="user">
      <ProfilePicture
        :user="user"
        :size="$q.platform.is.mobile ? 35 : 40"
      />
    </QItemSide>
    <QItemMain>
      <QItemTile
        label
        lines="2"
      >
        <QIcon
          v-if="icon"
          :name="icon"
          class="q-mr-xs vertical-baseline"
        />
        {{ message }}
      </QItemTile>
      <QItemTile
        sublabel
      >
        <DateAsWords
          :date="showExpiresAt ? notification.expiresAt : notification.createdAt"
          style="display: inline"
          :future="showExpiresAt"
        />
        · {{ groupName }}
        <template v-if="placeName">
          · {{ placeName }}
        </template>
      </QItemTile>
    </QItemMain>
  </QItem>
</template>

<script>
import notificationConfig from './notificationConfig'
import {
  QItem,
  QItemMain,
  QItemTile,
  QItemSide,
  QIcon,
} from 'quasar'
import DateAsWords from '@/utils/components/DateAsWords'
import ProfilePicture from '@/users/components/ProfilePicture'

export default {
  components: {
    QItem,
    QItemMain,
    QItemTile,
    QItemSide,
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

      // new_place is not about the user, but the place
      if (this.type === 'new_place') return

      return this.context.user
    },
    groupName () {
      if (!this.context) return
      return this.context.group && this.context.group.name
    },
    placeName () {
      if (!this.context || !this.context.pickup || !this.context.pickup.place) return ''
      return this.context.pickup.place.name
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
      const blacklist = [
        'feedback_possible',
      ]
      return this.notification && Boolean(this.notification.expiresAt) && !blacklist.includes(this.type)
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
