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
      v-for="user in participants"
      :key="'participant' + user.id"
      class="relative-position pic-wrapper"
    >
      <template
        v-if="getIsCurrentUser(user) && !hasStarted"
      >
        <CurrentUser
          :size="size"
          :user="currentUser"
          :is-leaving="isLeaving"
          @leave="$emit('leave')"
        />
      </template>
      <template v-else>
        <div
          v-if="getIsNewcomer(user.id) && !getIsCurrentUser(user)"
          class="newcomer-box"
          :title="$t('USERDATA.NEWCOMER_GUIDANCE', { userName: user.displayName })"
        />
        <ProfilePicture
          :user="user"
          :size="size"
        />
      </template>
    </div>

    <EmptySlot
      v-if="isJoining && !isUserMember"
      style="border-color: black"
      :is-loading="true"
      :size="size"
    />

    <UserSlot
      v-if="canJoin"
      :size="size"
      :user="currentUser"
      :show-join="!isUserMember"
      @join="$emit('join')"
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
import { computed } from 'vue'
import {
  QResizeObserver,
} from 'quasar'

import ProfilePicture from '@/users/components/ProfilePicture'
import UserSlot from './UserSlot'
import EmptySlot from './EmptySlot'
import CurrentUser from './CurrentUser'
import { useCurrentGroupService } from '@/group/services'
import { useAuthService } from '@/authuser/services'
import { useActivityHelpers } from '@/activities/helpers'
import { useUserService } from '@/users/services'
import { useAuthHelpers } from '@/authuser/helpers'

export default {
  components: {
    ProfilePicture,
    UserSlot,
    EmptySlot,
    CurrentUser,
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
    isJoining: {
      type: Boolean,
      default: false,
    },
    isLeaving: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'leave',
    'join',
  ],
  setup (props) {
    const { user: currentUser } = useAuthService()
    const { getIsNewcomer } = useCurrentGroupService()

    const {
      getUserById,
    } = useUserService()

    const {
      getHasStarted,
      getIsUserMember,
      getIsFull,
    } = useActivityHelpers()

    const {
      getIsCurrentUser,
    } = useAuthHelpers()

    const hasStarted = computed(() => getHasStarted(props.activity))
    const isUserMember = computed(() => getIsUserMember(props.activity))
    const isFull = computed(() => getIsFull(props.activity))

    const participants = computed(() => props.activity.participants.map(getUserById))

    return {
      hasStarted,
      isUserMember,
      isFull,
      participants,

      currentUser,

      getIsNewcomer,
      getIsCurrentUser,
    }
  },
  data () {
    return {
      slotsPerRow: 6,
    }
  },
  computed: {
    hasUnlimitedPlaces () {
      return this.activity.maxParticipants === null
    },
    emptyPlaces () {
      if (this.hasUnlimitedPlaces) {
        return 9999999999
      }
      if (this.activity.participants) {
        return Math.max(
          this.activity.maxParticipants - this.activity.participants.length - this.canJoinOrIsJoiningSlots,
          0,
        )
      }
      return 0
    },
    emptySlots () {
      if (this.activity.participants) {
        const minToShow = Math.min(1, this.emptyPlaces)
        const maxToShow = Math.max(
          minToShow,
          this.slotsPerRow - this.activity.participants.length - this.canJoinOrIsJoiningSlots - 1,
        )
        return Math.min(this.emptyPlaces, maxToShow)
      }
      return 0
    },
    canJoinOrIsJoiningSlots () {
      // this is the potential slot the user can click into (or has already)
      return this.isJoining || this.canJoin ? 1 : 0
    },
    noNotShownEmptySlots () {
      return this.emptyPlaces - this.emptySlots
    },
    canJoin () {
      const activity = this.activity
      if (activity.isDisabled || this.isFull || this.isUserMember) {
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
  },
}
</script>

<style scoped lang="sass">
@use 'sass:color'

.pic-wrapper
  margin-right: 3.8px

.newcomer-box
  position: absolute
  bottom: -4px
  left: 0
  width: 100%
  height: 8px
  background: linear-gradient(to bottom, $secondary, color.adjust($secondary, $lightness: 50%))

.emptySlots
  display: inline-block
  margin-bottom: 3.8px
  color: grey
  text-align: center
  background-color: rgba(255, 255, 255, 0.7)
  border: 2px dashed lightgrey
  border-radius: 0

  div
    display: inline-block
    height: 100%
    vertical-align: middle
</style>
