<template>
  <div class="row justify-start">
    <ProfilePicture
      v-for="user in users"
      v-if="user.id !== currentUser.id"
      :key="'0' + user.id"
      :user="user"
      :size="size"
      class="profilePic" />

    <CurrentUser
      v-if="isUserMember"
      :size="size"
      :popup="leavePopup"
      :currentUser="currentUser"
      class="profilePic"
      v-on:leave="$emit('leave')"/>

    <UserSlot
      v-for="n in emptySlots"
      :key="n"
      :size="size"
      :showJoin="!isUserMember && n == 1"
      :popup="joinPopup"
      :currentUser="currentUser"
      class="profilePic"
      v-on:join="$emit('join')"/>

    <div v-if="noNotShownEmptySlots > 0" class="emptySlots" v-bind:style="{ width: size + 'px', height: size + 'px' }">
       <div></div>
       <span v-if="noNotShownEmptySlots <= 99">+ {{ noNotShownEmptySlots }}</span>
       <span v-if="noNotShownEmptySlots > 99">...</span>
    </div>
  </div>
</template>

<script>
import ProfilePicture from './ProfilePicture.vue'
import UserSlot from './UserSlot.vue'
import CurrentUser from './CurrentUser.vue'

export default {
  props: {
    joinPopup: { default: 'PICKUPLIST.ITEM.JOIN' },
    leavePopup: { default: 'PICKUPLIST.ITEM.LEAVE' },
    currentUser: { required: false },
    users: { required: true },
    slots: {
      required: false,
      default: 0,
    },
    size: {
      default: 36,
    },
    maxEmptyNumToShow: {
      default: 1,
    },
    minSlotsToShow: {
      default: 6,
    },
  },
  components: {
    ProfilePicture, UserSlot, CurrentUser,
  },
  computed: {
    emptyPlaces () {
      if (this.users) {
        return this.slots - this.users.length
      }
      return 0
    },
    emptySlots () {
      if (this.users) {
        const minToShow = Math.min(this.maxEmptyNumToShow, this.emptyPlaces)
        const maxToShow = Math.max(minToShow, this.minSlotsToShow - this.users.length - 1)
        return Math.min(this.emptyPlaces, maxToShow)
      }
      return 0
    },
    noNotShownEmptySlots () {
      return this.emptyPlaces - this.emptySlots
    },
    isUserMember () {
      const currentUser = this.users.filter((el) => el.id === this.currentUser.id)
      return currentUser.length > 0
    },
  },
}
</script>

<style scoped lang="stylus">
.emptySlots
    display inline-block
    border 2px dashed lightgrey
    color grey
    border-radius $borderRadius
    text-align center
    div
      display inline-block
      height 100%
      vertical-align middle
.profilePic
  margin-right .3em
</style>