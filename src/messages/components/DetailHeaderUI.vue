<template>
  <div
    v-if="conversation"
    class="DetailHeader"
  >
    <QToolbar
      color="secondary"
    >
      <QToolbarTitle
        v-if="pickup"
      >
        <span
          v-if="!$q.platform.is.mobile"
          v-t="'GROUP.PICKUP'"
        >&nbsp;</span>
        <strong>{{ $d(pickup.date, 'weekdayHourMinute') }}</strong>
        <span slot="subtitle">
          <strong v-if="pickup.store">
            <RouterLink :to="{ name: 'store', params: { groupId: pickup.group.id, storeId: pickup.store.id }}">
              {{ pickup.store.name }}
            </RouterLink>
          </strong>
          {{ $d(pickup.date, 'yearMonthDay') }}
        </span>
      </QToolbarTitle>
      <template v-else-if="user">
        <ProfilePicture
          :user="conversationPartner"
          :size="$q.platform.is.mobile ? 25 : 40"
        />
        <QToolbarTitle>
          {{ user.displayName }}
        </QToolbarTitle>
      </template>
      <template v-else-if="conversation.thread">
        <QIcon name="fas fw-fw fa-comments" />
        <QToolbarTitle>
          {{ $t('CONVERSATION.REPLIES') }}
        </QToolbarTitle>
      </template>
      <template v-else-if="application">
        <ProfilePicture
          v-if="!application.user.isCurrentUser"
          :user="application.user"
          :size="$q.platform.is.mobile ? 25 : 40"
        />
        <QToolbarTitle>
          <RouterLink :to="applicationLink">
            <span v-t="'APPLICATION.APPLICATION'" />
          </RouterLink>
          <span slot="subtitle">
            {{ application.user.isCurrentUser ? application.group.name : application.user.displayName }}
          </span>
          <small>
            <QIcon
              v-if="application.status === 'accepted'"
              name="fas fa-fw fa-check"
              :title="$t('GROUP.ADDED_BY', { userName: application.decidedBy.displayName })"
            />
            <QIcon
              v-else-if="application.status === 'pending'"
              name="fas fa-fw fa-hourglass-half"
              :title="application.user.isCurrentUser && $t('JOINGROUP.APPLICATION_PENDING')"
            />
            <QIcon
              v-else-if="application.status === 'declined'"
              name="fas fa-fw fa-times"
              :title="$t('GROUP.DECLINED_BY', { userName: application.decidedBy.displayName })"
            />
            <QIcon
              v-else-if="application.status === 'withdrawn'"
              name="fas fa-fw fa-trash-alt"
              :title="$t('APPLICATION.WITHDRAWN', { relativeDate: dateInWords(application.decidedAt) })"
            />
          </small>
        </QToolbarTitle>
        <QBtn
          flat
          round
          dense
          icon="help_outline"
          @click="applicationInfo"
        />
      </template>
      <NotificationToggle
        v-if="notifications !== null"
        :value="notifications"
        :user="currentUser"
        in-toolbar
        @click="toggleNotifications"
        :size="$q.platform.is.mobile ? 'sm' : 'md'"
      />
      <QBtn
        v-if="!$q.platform.is.mobile"
        flat
        round
        dense
        icon="close"
        @click="$emit('close')"
        :title="$t('BUTTON.CLOSE')"
      />
    </QToolbar>
    <div
      v-if="pickup || conversation.thread"
      class="k-participant-list row"
    >
      <div class="col">
        <ProfilePicture
          v-for="participant in participants"
          :key="participant.id"
          class="k-participant"
          :user="participant"
          :size="$q.platform.is.mobile ? 20 : 35"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from '@/users/components/ProfilePicture'
import NotificationToggle from '@/messages/components/NotificationToggle'
import dateFnsHelper from '@/utils/dateFnsHelper'

import {
  Dialog,
  QBtn,
  QToolbar,
  QToolbarTitle,
  QIcon,
} from 'quasar'

export default {
  components: {
    ProfilePicture,
    NotificationToggle,
    QBtn,
    QToolbar,
    QToolbarTitle,
    QIcon,
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
    pickup: {
      type: Object,
      default: null,
    },
    application: {
      type: Object,
      default: null,
    },
    conversation: {
      type: Object,
      default: null,
    },
    currentUser: {
      type: Object,
      default: null,
    },
  },
  computed: {
    notifications () {
      if (this.conversation.thread && this.conversation.threadMeta) {
        return !this.conversation.threadMeta.muted
      }
      if (typeof this.conversation.muted !== 'undefined') {
        return !this.conversation.muted
      }
      return null
    },
    participants () {
      if (this.conversation.thread && this.conversation.threadMeta) {
        return this.conversation.threadMeta.participants
      }
      return this.conversation.participants
    },
    applicationLink () {
      if (!this.application) return
      if (this.application.user.isCurrentUser) {
        return {
          name: 'groupPreview',
          params: {
            groupPreviewId: this.application.group.id,
          },
        }
      }
      else {
        return {
          name: 'applications',
          params: {
            groupId: this.application.group.id,
          },
        }
      }
    },
    conversationPartner () {
      return this.conversation && this.conversation.participants && this.conversation.participants.find(e => !e.isCurrentUser)
    },
  },
  methods: {
    toggleNotifications () {
      const data = (this.conversation.thread && this.conversation.threadMeta)
        ? {
          threadId: this.conversation.thread,
          value: this.notifications,
        }
        : {
          conversationId: this.conversation.id,
          value: this.notifications,
        }
      this.$emit('setMuted', data)
    },
    applicationInfo () {
      Dialog.create({
        title: this.$t('APPLICATION.WHAT'),
        message: this.$t('APPLICATION.HELP', { groupName: this.application.group.name, userName: this.application.user.displayName }),
        ok: this.$t('BUTTON.BACK'),
      })
    },
    dateInWords (date) {
      return dateFnsHelper.distanceInWordsToNow(date, { addSuffix: true, disallowFuture: true })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.DetailHeader
  .k-participant-list
    background-color #f5f5f5
    padding 0.3em
    padding-bottom 0
  .k-participant
    display inline-block
    margin-right 0.3em
    margin-bottom 0.3em
body.mobile .DetailHeader .q-toolbar
  min-height 20px
  .q-toolbar-title
    font-size 16px
</style>
