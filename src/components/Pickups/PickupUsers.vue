<template>
  <div
    class="row justify-start"
    ref="wrapperDiv"
  >
    <q-resize-observable
      style="width: 100%"
      @resize="calculateSlotsPerRow"
    />
    <ProfilePicture
      v-for="user in pickup.collectors"
      v-if="!user.isCurrentUser"
      :key="'0' + user.id"
      :user="user"
      :size="size"
      class="profilePic clickable"
    />

    <div
      v-if="isJoiningOrLeaving(pickup)"
      class="emptySlots profilePic"
      style="border-color: black"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <q-spinner />
    </div>

    <transition
      appear
      :duration="{ enter: 500, leave: 0 }"
      name="bounce"
    >
      <CurrentUser
        v-if="pickup.isUserMember && !isJoiningOrLeaving(pickup)"
        :size="size"
        :user="currentUser"
        class="profilePic clickable"
        @leave="$emit('leave')"
      />
    </transition>

    <UserSlot
      v-for="n in emptySlots"
      :key="n"
      :size="size"
      :hover-user="currentUser"
      :show-join="!pickup.isUserMember && n == 1"
      v-if="n > 1 || !(isJoiningOrLeaving(pickup) && !pickup.isUserMember)"
      class="profilePic"
      :class="{clickable: !pickup.isUserMember && n == 1}"
      @join="$emit('join')"
    />

    <div
      v-if="noNotShownEmptySlots > 0"
      class="emptySlots profilePic"
      :style="{ width: size + 'px', height: size + 'px' }"
    >
      <div/>
      <span v-if="noNotShownEmptySlots <= 99">+ {{ noNotShownEmptySlots }}</span>
      <span v-if="noNotShownEmptySlots > 99">...</span>
    </div>
  </div>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import UserSlot from './UserSlot'
import CurrentUser from './CurrentUser'
import { mapGetters } from 'vuex'
import { QSpinner, QResizeObservable } from 'quasar'

export default {
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
  components: {
    ProfilePicture, UserSlot, CurrentUser, QSpinner, QResizeObservable,
  },
  methods: {
    isJoiningOrLeaving (pickup) {
      return pickup.joinStatus.pending || pickup.leaveStatus.pending
    },
    calculateSlotsPerRow () {
      if (this.$refs.wrapperDiv) {
        this.slotsPerRow = Math.floor(this.$refs.wrapperDiv.clientWidth / (this.size + 3.8))
      }
    },
  },
  computed: {
    ...mapGetters({
      currentUser: 'auth/user',
    }),
    emptyPlaces () {
      if (this.pickup.collectors) {
        return this.pickup.maxCollectors - this.pickup.collectors.length
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
  },
}
</script>

<style scoped lang="stylus">
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
.profilePic.clickable
  margin-right .3em
  transition transform .1s ease
.profilePic.clickable:hover
  transform scale(1.1)

.bounce-enter-active
  animation bounceIn .4s

.bounce-leave-active
  display none

@keyframes bounceIn{
  0% {
    opacity: 0;
    transform: scale(0.3) translate3d(0,0,0);
  }
  60%{
    opacity: 0.9;
    transform: scale(1.1);
  }
  80%{
    opacity: 1;
    transform: scale(0.89);
  }
  100%{
    opacity: 1;
    transform: scale(1) translate3d(0,0,0);
  }
}
</style>
