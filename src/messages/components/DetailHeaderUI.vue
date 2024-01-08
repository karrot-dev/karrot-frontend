<template>
  <div
    v-if="conversation"
    class="DetailHeader full-width"
  >
    <QToolbar
      class="text-white"
      :class="activityType ? `bg-${getColorName(activityType)}` : 'bg-secondary'"
    >
      <template v-if="activity">
        <QToolbarTitle class="column">
          <div>
            <span
              v-if="!$q.platform.is.mobile && activityType"
            >
              <QIcon
                v-bind="activityTypeIconProps"
                color="white"
                size="xs"
                class="q-pr-sm"
              />{{ activityTypeIconProps.title }}&nbsp;</span>
            <strong>
              {{ $d(activity.date, 'weekdayHourMinute') }}
              <template v-if="activity.hasDuration"> &mdash; {{ $d(activity.dateEnd, 'hourMinute') }}</template>
            </strong>
          </div>
          <div class="text-caption">
            <strong v-if="place">
              <RouterLink :to="{ name: 'place', params: { groupId: place.group, placeId: activity.place }}">
                {{ place.name }}
              </RouterLink>
            </strong>
            {{ $d(activity.date, 'yearMonthDay') }}
          </div>
        </QToolbarTitle>
        <MeetButton
          flat
          round
          dense
          :room="`activity:${activity.id}`"
        />
      </template>
      <template v-else-if="user">
        <ProfilePicture
          :user="conversationPartner"
          :size="$q.platform.is.mobile ? 25 : 40"
        />
        <QToolbarTitle>
          {{ user.displayName }}
        </QToolbarTitle>
        <MeetButton
          flat
          round
          dense
          :room="`user:${[user.id, currentUserId].join(',')}`"
        />
      </template>
      <template v-else-if="conversation.thread">
        <QIcon name="fas fa-fw fa-comments" />
        <QToolbarTitle>
          {{ $t('CONVERSATION.REPLIES') }}
        </QToolbarTitle>
      </template>
      <template v-else-if="application">
        <ProfilePicture
          v-if="!getIsCurrentUser(application.user)"
          :user="application.user"
          :size="$q.platform.is.mobile ? 25 : 40"
        />
        <QToolbarTitle class="column">
          <div>
            <RouterLink :to="applicationLink">
              <span v-t="'APPLICATION.APPLICATION'" />
            </RouterLink>
            <small>
              <QIcon
                v-if="application.status === 'accepted'"
                name="fas fa-fw fa-check"
                :title="$t('GROUP.ADDED_BY', { userName: getUserById(application.decidedBy).displayName })"
              />
              <QIcon
                v-else-if="application.status === 'pending'"
                name="fas fa-fw fa-hourglass-half"
                :title="getIsCurrentUser(application.user) && $t('JOINGROUP.APPLICATION_PENDING')"
              />
              <QIcon
                v-else-if="application.status === 'declined'"
                name="fas fa-fw fa-times"
                :title="$t('GROUP.DECLINED_BY', { userName: getUserById(application.decidedBy).displayName })"
              />
              <QIcon
                v-else-if="application.status === 'withdrawn'"
                name="fas fa-fw fa-trash-alt"
                :title="$t('APPLICATION.WITHDRAWN', { relativeDate: dateInWords(application.decidedAt) })"
              />
            </small>
          </div>
          <div class="text-caption">
            <span>
              {{ getIsCurrentUser(application.user) ? getGroupById(application.group).name : application.user.displayName }}
            </span>
          </div>
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
        v-if="isThread ? muted !== null : true"
        :muted="muted"
        :is-participant="isThread ? true : isParticipant"
        :can-unsubscribe="!isThread && !isPrivate"
        :user="currentUser"
        in-toolbar
        :size="$q.platform.is.mobile ? 'sm' : 'md'"
        @set="setNotifications"
      />
      <QBtn
        v-if="!$q.platform.is.mobile"
        flat
        round
        dense
        icon="close"
        :title="$t('BUTTON.CLOSE')"
        @click="close()"
      />
    </QToolbar>
    <div
      v-if="activity || conversation.thread"
      class="k-participant-list row"
    >
      <ProfilePicture
        v-for="participant in participants"
        :key="participant.id"
        :user="participant"
        :size="$q.platform.is.mobile ? 20 : 35"
      />
    </div>
  </div>
</template>

<script>
import {
  Dialog,
  QBtn,
  QToolbar,
  QToolbarTitle,
  QIcon,
} from 'quasar'
import { toRefs, computed } from 'vue'

import { useActivityTypeHelpers } from '@/activities/helpers'
import { useActivityTypeService } from '@/activities/services'
import { useAuthHelpers } from '@/authuser/helpers'
import { useAuthService } from '@/authuser/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { useConversationHelpers } from '@/messages/helpers'
import { useSaveConversationMutation, useSaveThreadMutedMutation } from '@/messages/mutations'
import { useDetailService } from '@/messages/services'
import { usePlaceService } from '@/places/services'
import { useUserService } from '@/users/services'
import dateFnsHelper from '@/utils/dateFnsHelper'

import MeetButton from '@/meet/components/MeetButton.vue'
import NotificationToggle from '@/messages/components/NotificationToggle.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'

export default {
  components: {
    MeetButton,
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
    activity: {
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
  setup (props) {
    const {
      conversation,
      activity,
    } = toRefs(props)

    const { getUserById } = useUserService()
    const { getPlaceById } = usePlaceService()
    const { getActivityTypeById } = useActivityTypeService()
    const { close } = useDetailService()
    const { getIsParticipant } = useConversationHelpers()
    const { userId: currentUserId } = useAuthService()
    const { getIsCurrentUser } = useAuthHelpers()
    const { getGroupById } = useGroupInfoService()
    const { mutate: saveConversation } = useSaveConversationMutation()
    const { mutate: saveThreadMuted } = useSaveThreadMutedMutation()

    const {
      getColorName,
      getIconProps,
    } = useActivityTypeHelpers()

    const isParticipant = computed(() => getIsParticipant(conversation.value))

    const place = computed(() => getPlaceById(activity.value?.place))
    const activityType = computed(() => getActivityTypeById(activity.value?.activityType))
    const activityTypeIconProps = computed(() => activityType.value && getIconProps(activityType.value))

    return {
      isParticipant,

      place,
      activityType,
      activityTypeIconProps,
      currentUserId,

      getIsCurrentUser,
      getGroupById,
      getColorName,
      getUserById,
      getPlaceById,

      saveConversation,
      saveThreadMuted,
      close,
    }
  },
  computed: {
    isThread () {
      return Boolean(this.conversation.thread && this.conversation.id === this.conversation.thread)
    },
    isPrivate () {
      return this.conversation && this.conversation.type === 'private'
    },
    muted () {
      if (this.conversation.thread && this.conversation.threadMeta) {
        return this.conversation.threadMeta.muted ?? null
      }
      if (this.conversation.notifications === 'muted') {
        return true
      }
      return null
    },
    participants () {
      if (this.activity) {
        return this.activity.participants.map(({ user }) => this.getUserById(user))
      }
      if (this.conversation.thread && this.conversation.threadMeta) {
        return this.conversation.threadMeta.participants.map(this.getUserById)
      }
      return this.conversation.participants.map(this.getUserById)
    },
    applicationLink () {
      if (!this.application) return
      if (this.getIsCurrentUser(this.application.user)) {
        return {
          name: 'groupPreview',
          params: {
            groupPreviewId: this.application.group,
          },
        }
      }
      else {
        return {
          name: 'applications',
          params: {
            groupId: this.application.group,
          },
        }
      }
    },
    conversationPartner () {
      return this.participants.find(user => user.id !== this.currentUser.id)
    },
  },
  methods: {
    setNotifications (value) {
      if (this.conversation.thread && this.conversation.threadMeta) {
        try {
          this.saveThreadMuted({
            threadId: this.conversation.thread,
            muted: value.notifications !== 'all',
          })
        }
        catch (error) {
          console.error(error)
        }
      }
      else {
        this.saveConversation({
          id: this.conversation.id,
          value,
        })
      }
    },
    applicationInfo () {
      Dialog.create({
        title: this.$t('APPLICATION.WHAT'),
        message: this.$t('APPLICATION.HELP', { groupName: this.getGroupById(this.application.group).name, userName: this.application.user.displayName }),
        ok: this.$t('BUTTON.BACK'),
      })
    },
    dateInWords (date) {
      return dateFnsHelper.formatDistanceToNow(date, { addSuffix: true, future: false, strict: false })
    },
  },
}
</script>

<style scoped lang="sass">
.DetailHeader
  .k-participant-list
    background-color: #f5f5f5
    gap: 0.3em
    padding: 0.3em

  .q-toolbar-title
    font-size: 16px

body.mobile .DetailHeader .q-toolbar
  min-height: 20px
</style>
