<template>
  <QItem
    :class="{ isUnread }"
    active-class="unset-active-class"
    :to="routeTo"
    @click="$emit('click', notification)"
  >
    <QItemSection
      v-if="user"
      side
      class="q-pr-sm"
    >
      <ProfilePicture
        :user="user"
        :size="$q.platform.is.mobile ? 35 : 40"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel
        lines="2"
      >
        <QIcon
          v-if="icon"
          :name="icon"
          class="q-mx-xs vertical-baseline"
        />
        {{ message }}
      </QItemLabel>
      <QItemLabel
        caption
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
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script>

import {
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
} from 'quasar'

import { useAuthHelpers } from '@/authuser/helpers'
import { useGroupInfoService } from '@/groupInfo/services'
import { useNotificationHelpers } from '@/notifications/helpers'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'

import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'

export default {
  components: {
    QItem,
    QItemSection,
    QItemLabel,
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
  emits: [
    'click',
  ],
  setup () {
    const { getUserById } = useUserService()
    const { getPlaceById } = usePlaceService()
    const { getIsCurrentUser } = useAuthHelpers()
    const { getNotificationConfig } = useNotificationHelpers()
    const { getGroupById } = useGroupInfoService()

    return {
      getUserById,
      getPlaceById,
      getIsCurrentUser,
      getNotificationConfig,
      getGroupById,
    }
  },
  computed: {
    isUnread () {
      return this.notification && !this.notification.clicked
    },
    context () {
      return this.notification && this.notification.context
    },
    type () {
      return this.notification && this.notification.type
    },
    config () {
      if (!this.type || !this.context) return
      return this.getNotificationConfig(this.type, this.context)
    },
    user () {
      if (!this.context) return
      if (!this.context.user) return

      // new_place is not about the user, but the place
      if (this.type === 'new_place') return

      return this.getUserById(this.context.user)
    },
    groupName () {
      if (!this.context) return
      return this.context.group && this.getGroupById(this.context.group)?.name
    },
    place () {
      if (!this.context) return
      if (this.context.activity) return this.context.activity.place
      return this.context.place
    },
    placeName () {
      if (!this.place) return ''
      return this.getPlaceById(this.place)?.name
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

<style scoped lang="sass">
@use "sass:color"
.isUnread
  background: linear-gradient(to right, $lightGreen, $lighterGreen)

  &:hover
    background: color.change($grey, $alpha: 0.5)
</style>
