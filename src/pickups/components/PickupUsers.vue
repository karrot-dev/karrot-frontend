<template>
  <div
    ref="wrapperDiv"
    class="row justify-start"
  >
    <QResizeObservable
      style="width: 100%"
      @resize="calculateSlotsPerRow"
    />
    <div
      v-for="user in pickup.collectors"
      :key="'collector' + user.id"
      class="relative-position pic-wrapper"
    >
      <template
        v-if="user.isCurrentUser && !pickup.hasStarted"
      >
        <CurrentUser
          v-if="!isLeaving"
          :size="size"
          :user="currentUser"
          :pickup="pickup"
          @leave="$emit('leave')"
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
      v-if="isJoining && !pickup.isUserMember"
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
      :show-join="!pickup.isUserMember"
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
import ProfilePicture from '@/users/components/ProfilePicture'
import UserSlot from './UserSlot'
import EmptySlot from './EmptySlot'
import CurrentUser from './CurrentUser'
import { mapGetters } from 'vuex'
import {
  QSpinner,
  QResizeObservable,
} from 'quasar'

export default {
  components: {
    ProfilePicture,
    UserSlot,
    EmptySlot,
    CurrentUser,
    QSpinner,
    QResizeObservable,
  },
  props: {
    pickup: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      default: 36,
    },
    maxEmptyNumToShow: {
      type: Number,
      default: 1,
    },
  },
  data () {
    return {
      slotsPerRow: 6,
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/user',
    }),
    isJoining () {
      // if request is in progress and user is not member yet (watches out for websocket updates!)
      return this.pickup.joinStatus.pending && !this.pickup.isUserMember
    },
    isLeaving () {
      // if request is in progress and user has not left yet
      return this.pickup.leaveStatus.pending && this.pickup.isUserMember
    },
    hasUnlimitedPlaces () {
      return this.pickup.maxCollectors === null
    },
    emptyPlaces () {
      if (this.hasUnlimitedPlaces) {
        return 9999999999
      }
      if (this.pickup.collectors) {
        const removeOne = (this.isJoining || this.canJoin) ? 1 : 0
        return Math.max(this.pickup.maxCollectors - this.pickup.collectors.length - removeOne, 0)
      }
      return 0
    },
    emptySlots () {
      if (this.pickup.collectors) {
        const minToShow = Math.min(this.maxEmptyNumToShow, this.emptyPlaces)
        const maxToShow = Math.max(minToShow, this.slotsPerRow - this.pickup.collectors.length - 1)
        return Math.min(this.emptyPlaces, maxToShow)
      }
      return 0
    },
    noNotShownEmptySlots () {
      return this.emptyPlaces - this.emptySlots
    },
    canJoin () {
      const pickup = this.pickup
      if (pickup.isDisabled || pickup.isFull || pickup.isUserMember) {
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
  height 8px
  width 100%
  position absolute
  bottom -4px
  left 0
  background linear-gradient(to bottom, $secondary, lighten($secondary, 50))
.emptySlots
  display inline-block
  background-color rgba(255, 255, 255, 0.7)
  border 2px dashed lightgrey
  color grey
  border-radius $borderRadius
  margin-bottom 3.8px
  text-align center
  div
    display inline-block
    height 100%
    vertical-align middle
</style>
