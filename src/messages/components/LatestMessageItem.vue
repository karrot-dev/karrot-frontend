<template>
  <QItem
    link
    :class="{ isUnread: unreadCount > 0 && !muted, selected }"
    @click.native="$emit('open')"
  >
    <QItemSide
      v-if="isPrivate || isApplication"
    >
      <ProfilePicture
        :user="user || application.user"
        :size="$q.platform.is.mobile ? 35 : 40"
      />
    </QItemSide>
    <QItemMain>
      <QItemTile
        label
        class="row no-wrap justify-between items-baseline"
      >
        <div class="row no-wrap items-baseline ellipsis">
          <template v-if="isPrivate">
            {{ user.displayName }}
          </template>
          <template v-else-if="isPickup">
            <QIcon
              name="fas fa-fw fa-shopping-basket"
              class="q-mr-sm"
            />
            {{ $d(pickup.date, 'weekdayHourMinute') }}
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
          <QIcon
            v-if="muted"
            size="12px"
            color="grey"
            class="q-ml-xs"
            name="fas fa-fw fa-bell-slash"
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
      </QItemTile>
      <QItemTile
        v-if="isPickup"
        label
        class="q-mb-xs"
      >
        <small>
          {{ pickup.place && pickup.place.name }} ·
          {{ $d(pickup.date, 'yearMonthDay') }}
        </small>
      </QItemTile>
      <QItemTile
        v-if="message"
        sublabel
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
        <QChip
          v-if="unreadCount > 0"
          round
          :color="muted ? 'grey' : 'secondary'"
          class="inline-chip"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </QChip>
      </QItemTile>
    </QItemMain>
  </QItem>
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
import DateAsWords from '@/utils/components/DateAsWords'
import ProfilePicture from '@/users/components/ProfilePicture'

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
    group: {
      type: Object,
      default: null,
    },
    user: {
      type: Object,
      default: null,
    },
    pickup: {
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
    isPickup () {
      return Boolean(this.pickup)
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

.q-chip.inline-chip
  position relative
  bottom -3px
  min-height 22px
  padding 0 7px
  margin-left 2px

.selected
  background $item-highlight-color
</style>
