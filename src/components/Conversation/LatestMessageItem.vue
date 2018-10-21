<template>
  <q-item
    link
    :class="{ isUnread: unreadCount > 0 && !muted, selected }"
    @click.native="$emit('open')"
  >
    <q-item-side
      v-if="isPrivate || isApplication"
    >
      <ProfilePicture
        :user="user || application.user"
        :size="$q.platform.is.mobile ? 35 : 40"
      />
    </q-item-side>
    <q-item-main>
      <q-item-tile
        label
        class="row no-wrap justify-between items-baseline"
      >
        <div class="row no-wrap items-baseline ellipsis">
          <template v-if="isPrivate">
            {{ user.displayName }}
          </template>
          <template v-else-if="isPickup">
            <q-icon
              name="fas fa-fw fa-shopping-basket"
              class="q-mr-sm"
            />
            {{ $d(pickup.date, 'dayAndTime') }}
          </template>
          <template v-else-if="isThread">
            <q-icon
              name="fas fw-fw fa-comments"
              class="q-mr-sm"
            />
            <div class="ellipsis">{{ thread.content }}</div>
          </template>
          <template v-else-if="isApplication">
            <q-icon
              name="fas fw-fw fa-user-plus"
              class="q-mr-sm"
              :title="$t('APPLICATION.APPLICATION')"
            />
            <div class="ellipsis">
              {{ applicationTitle }}
            </div>
          </template>
          <template v-else-if="isGroup">
            <q-icon
              name="fas fw-fw fa-bullhorn"
              class="q-mr-sm"
              :title="$t('GROUP.WALL')"
            />
            <div class="ellipsis">{{ group.name }}</div>
          </template>
          <q-icon
            v-if="muted"
            size="12px"
            color="grey"
            class="q-ml-xs"
            name="fas fa-fw fa-bell-slash"
            :title="$t('CONVERSATION.MUTED')"
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
      </q-item-tile>
      <q-item-tile
        v-if="isPickup"
        label
        class="q-mb-xs"
      >
        <small>
          {{ pickup.store && pickup.store.name }} ·
          {{ $d(pickup.date, 'dateShort') }}
        </small>
      </q-item-tile>
      <q-item-tile
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
        <div class="ellipsis col">{{ message.content }}</div>
        <q-chip
          v-if="unreadCount > 0"
          round
          :color="muted ? 'grey' : 'secondary'"
          class="inline-chip"
        >
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </q-chip>
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
    thread: {
      type: Object,
      default: null,
    },
    application: {
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
    selected: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isGroup () {
      return Boolean(this.group)
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
    applicationTitle () {
      if (this.isApplication && this.application.group) {
        return this.application.user.isCurrentUser
          ? this.application.group.name
          : this.application.user.displayName
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
