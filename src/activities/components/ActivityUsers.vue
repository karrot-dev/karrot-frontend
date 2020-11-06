<template>
  <div
    ref="wrapperDiv"
    class="row justify-start"
  >
    <QResizeObserver
      style="width: 100%"
      @resize="calculateSlotsPerRow"
    />
    <div
      v-for="user in activity.participants"
      :key="'participant' + user.id"
      class="relative-position pic-wrapper"
    >
      <template
        v-if="user.isCurrentUser && !activity.hasStarted"
      >
        <CurrentUser
          v-if="!isLeaving"
          :size="size"
          :user="currentUser"
          :activity="activity"
          @leave="leave(activity)"
        />
        <div
          v-else
          class="emptySlots"
          style="border-color: black"
          :style="{ width: size + 'px', height: size + 'px' }"
        >
          <QSpinner :size="size - 4" />
        </div>
      </template>
      <template v-else>
        <div
          v-if="isNewcomer(user) && !user.isCurrentUser"
          class="newcomer-box"
          :title="$t('USERDATA.NEWCOMER_GUIDANCE', { userName: user.displayName })"
        />
        <ProfilePicture
          :user="user"
          :size="size"
        />
      </template>
    </div>

    <div
      v-if="isJoining && !activity.isUserMember"
      class="emptySlots"
      style="border-color: black"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <QSpinner :size="size - 4" />
    </div>

    <UserSlot
      v-if="canJoin"
      :size="size"
      :hover-user="currentUser"
      :show-join="!activity.isUserMember"
      @join="join(activity)"
    />

    <EmptySlot
      v-for="n in emptySlots"
      :key="n"
      :size="size"
    />

    <div
      v-if="noNotShownEmptySlots > 0"
      class="emptySlots"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <div />
      <span v-if="noNotShownEmptySlots <= 99">+ {{ noNotShownEmptySlots }}</span>
      <span v-if="noNotShownEmptySlots > 99 && !hasUnlimitedPlaces">...</span>
      <span v-if="noNotShownEmptySlots > 99 && hasUnlimitedPlaces">+ ∞</span>
    </div>
  </div>
</template>

<script>
import ProfilePicture from '@/users/components/ProfilePicture'
import UserSlot from './UserSlot'
import EmptySlot from './EmptySlot'
import CurrentUser from './CurrentUser'
import {
  QSpinner,
  QResizeObserver,
  Dialog,
} from 'quasar'
import { useActivityActions } from '@/activities/data/useActivities'
import { useI18n } from '@/activities/data/useI18n'
import { useAuthUser } from '@/activities/data/useAuthUser'

export default {
  components: {
    ProfilePicture,
    UserSlot,
    EmptySlot,
    CurrentUser,
    QSpinner,
    QResizeObserver,
  },
  props: {
    activity: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
    },
  },
  setup () {
    const { t, d } = useI18n()
    const { authUser: currentUser } = useAuthUser()
    // TODO: maybe put these up to the ActivityList component so there is not one per activity?
    // ... but then need to pass status up through props, so maybe actions could return the status too? but then status can be null so lots more if checks...
    // ... maybe it's fine
    const { join, leave, joinStatus, leaveStatus } = useActivityActions()
    return {
      currentUser,
      join (activity) {
        Dialog.create({
          title: t('ACTIVITYLIST.ITEM.JOIN_CONFIRMATION_HEADER'),
          message: t('ACTIVITYLIST.ITEM.JOIN_CONFIRMATION_TEXT', { date: d(activity.date, 'long') }),
          ok: t('BUTTON.OF_COURSE'),
          cancel: t('BUTTON.CANCEL'),
        })
          .onOk(() => join(activity.id))
      },
      leave (activity) {
        if (!activity.hasStarted) {
          Dialog.create({
            title: t('ACTIVITYLIST.ITEM.LEAVE_CONFIRMATION_HEADER'),
            message: t('ACTIVITYLIST.ITEM.LEAVE_CONFIRMATION_TEXT'),
            ok: t('BUTTON.YES'),
            cancel: t('BUTTON.CANCEL'),
          })
            .onOk(() => leave(activity.id))
        }
      },
      joinStatus,
      leaveStatus,
    }
  },
  data () {
    return {
      slotsPerRow: 6,
    }
  },
  computed: {
    isJoining () {
      // if request is in progress and user is not member yet (watches out for websocket updates!)
      return this.joinStatus.pending && !this.activity.isUserMember
    },
    isLeaving () {
      // if request is in progress and user has not left yet
      return this.leaveStatus.pending && this.activity.isUserMember
    },
    hasUnlimitedPlaces () {
      return this.activity.maxParticipants === null
    },
    emptyPlaces () {
      if (this.hasUnlimitedPlaces) {
        return 9999999999
      }
      if (this.activity.participants) {
        const removeOne = (this.isJoining || this.canJoin) ? 1 : 0
        return Math.max(this.activity.maxParticipants - this.activity.participants.length - removeOne, 0)
      }
      return 0
    },
    emptySlots () {
      if (this.activity.participants) {
        const minToShow = Math.min(1, this.emptyPlaces)
        const maxToShow = Math.max(minToShow, this.slotsPerRow - this.activity.participants.length - 1)
        return Math.min(this.emptyPlaces, maxToShow)
      }
      return 0
    },
    noNotShownEmptySlots () {
      return this.emptyPlaces - this.emptySlots
    },
    canJoin () {
      const activity = this.activity
      if (activity.isDisabled || activity.isFull || activity.isUserMember) {
        return false
      }
      if (this.isJoining || this.isLeaving) {
        return false
      }
      return true
    },
  },
  methods: {
    calculateSlotsPerRow () {
      if (this.$refs.wrapperDiv) {
        this.slotsPerRow = Math.floor(this.$refs.wrapperDiv.clientWidth / (this.size + 3.8))
      }
    },
    isNewcomer (user) {
      return user.membership && !user.membership.isEditor
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.pic-wrapper
  margin-right 3px

.newcomer-box
  position absolute
  bottom -4px
  left 0
  width 100%
  height 8px
  background linear-gradient(to bottom, $secondary, lighten($secondary, 50))

.emptySlots
  display inline-block
  margin-bottom 3.8px
  color grey
  text-align center
  background-color rgba(255, 255, 255, 0.7)
  border 2px dashed lightgrey
  border-radius 0

  div
    display inline-block
    height 100%
    vertical-align middle
</style>
