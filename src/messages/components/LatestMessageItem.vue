<template>
  <QItem
    :class="{ isUnread: unreadCount > 0 && !muted, selected }"
    clickable
    @click="$emit('open')"
  >
    <QItemSection
      v-if="isPrivate || isApplication"
      side
      class="q-pr-sm"
    >
      <ProfilePicture
        :user="user || application.user"
        :size="$q.platform.is.mobile ? 30 : 35"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel
        class="row no-wrap justify-between items-baseline"
      >
        <div class="row no-wrap items-baseline ellipsis">
          <template v-if="isPrivate">
            {{ user.displayName }}
          </template>
          <template v-else-if="isActivity">
            <QIcon
              :name="$icon('activity_fw')"
              class="q-mr-sm"
            />
            {{ $d(activity.date, 'weekdayHourMinute') }}
          </template>
          <template v-else-if="isThread">
            <QIcon
              name="fas fa-fw fa-comments"
              class="q-mr-sm"
            />
            <div class="ellipsis">
              {{ thread.content }}
            </div>
          </template>
          <template v-else-if="isApplication">
            <QIcon
              name="fas fa-fw fa-user-plus"
              class="q-mr-sm"
              :title="$t('APPLICATION.APPLICATION')"
            />
            <div class="ellipsis">
              {{ applicationTitle }}
            </div>
          </template>
          <template v-else-if="isGroup">
            <QIcon
              name="fas fa-fw fa-bullhorn"
              class="q-mr-sm"
              :title="$t('GROUP.WALL')"
            />
            <div class="ellipsis">
              {{ group.name }}
            </div>
          </template>
          <template v-else-if="isPlace">
            <QIcon
              name="fas fa-fw fa-star"
              class="q-mr-sm"
              :title="$t('GROUP.WALL')"
            />
            <div class="ellipsis">
              {{ place.name }}
            </div>
          </template>
          <template v-else-if="isIssue">
            <QIcon
              name="fas fa-fw fa-vote-yea"
              class="q-mr-sm"
              :title="$t('ISSUE.TITLE')"
            />
            <div class="ellipsis">
              {{ issue.affectedUser && issue.affectedUser.displayName }}
            </div>
          </template>
          <template v-else-if="isOffer">
            <QIcon
              :name="$icon('offer')"
              class="q-mr-sm"
              :title="$t('OFFER.NAME')"
            />
            <div class="ellipsis">
              {{ offer.name }}
            </div>
          </template>
          <QIcon
            v-if="muted"
            size="12px"
            color="grey"
            class="q-ml-xs"
            name="fas fa-fw fa-bell"
            :title="$t('CONVERSATION.MUTED')"
          />
          <QIcon
            v-if="closed"
            size="12px"
            color="grey"
            class="q-ml-xs"
            name="fas fa-fw fa-lock"
            :title="$t('CONVERSATION.CLOSED')"
          />
        </div>
        <span v-if="message">
          <small>
            <DateAsWords
              class="q-pl-xs"
              style="white-space: nowrap"
              :date="message.createdAt"
            />
          </small>
        </span>
      </QItemLabel>
      <QItemLabel
        v-if="isActivity"
        class="q-mb-xs"
      >
        <small>
          {{ activity.place && activity.place.name }} ·
          {{ $d(activity.date, 'yearMonthDay') }}
        </small>
      </QItemLabel>
      <QItemLabel
        v-if="message"
        caption
        class="row no-wrap items-baseline"
        style="max-height: 18px"
      >
        <div
          v-if="!isPrivate && !message.author.isCurrentUser"
          class="text-secondary"
        >
          {{ message.author.displayName }}:&nbsp;
        </div>
        <div
          v-if="message.author.isCurrentUser"
          class="text-secondary"
        >
          {{ $t('YOU') }}:&nbsp;
        </div>
        <div class="ellipsis col">
          {{ message.content }}
        </div>
        <QBadge
          v-if="unreadCount > 0"
          :color="muted ? 'grey' : 'secondary'"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </QBadge>
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script>
import {
  QItem,
  QItemSection,
  QItemLabel,
  QBadge,
  QIcon,
} from 'quasar'
import DateAsWords from '@/utils/components/DateAsWords'
import ProfilePicture from '@/users/components/ProfilePicture'

export default {
  components: {
    QItem,
    QItemSection,
    QItemLabel,
    QBadge,
    QIcon,
    DateAsWords,
    ProfilePicture,
  },
  props: {
    group: {
      type: Object,
      default: null,
    },
    user: {
      type: Object,
      default: null,
    },
    activity: {
      type: Object,
      default: null,
    },
    place: {
      type: Object,
      default: null,
    },
    thread: {
      type: Object,
      default: null,
    },
    application: {
      type: Object,
      default: null,
    },
    issue: {
      type: Object,
      default: null,
    },
    offer: {
      type: Object,
      default: null,
    },
    message: {
      type: Object,
      default: null,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
    muted: {
      type: Boolean,
      default: false,
    },
    closed: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isGroup () {
      return Boolean(this.group)
    },
    isPlace () {
      return Boolean(this.place)
    },
    isPrivate () {
      return Boolean(this.user)
    },
    isActivity () {
      return Boolean(this.activity)
    },
    isThread () {
      return Boolean(this.thread)
    },
    isApplication () {
      return Boolean(this.application)
    },
    isIssue () {
      return Boolean(this.issue)
    },
    isOffer () {
      return Boolean(this.offer)
    },
    applicationTitle () {
      if (!this.isApplication || !this.application.group) return ''
      return this.application.user.isCurrentUser
        ? this.application.group.name
        : this.application.user.displayName
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

.message-content
  width 100%
  overflow hidden

.selected
  background $item-highlight-color
</style>
