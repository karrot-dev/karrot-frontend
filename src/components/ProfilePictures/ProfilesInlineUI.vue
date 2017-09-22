<template>
  <div class="row justify-start no-wrap">
    <CurrentUser
      v-if="isUserMember"
      :size="size"
      :popup="leavePopup"
      :currentUser="currentUser"
      class="profilePic"
      v-on:leave="$emit('leave')"/>

    <ProfilePicture
      v-for="user in users"
      v-if="user.id !== currentUser.id"
      :key="'0' + user.id"
      :user="user"
      :size="size"
      class="profilePic" />-

    <UserSlot
      v-for="n in emptySlots"
      :key="n"
      :size="size"
      :showJoin="!isUserMember"
      :popup="joinPopup"
      :currentUser="currentUser"
      class="profilePic"
      v-on:join="$emit('join')"/>
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
  },
  components: {
    ProfilePicture, UserSlot, CurrentUser,
  },
  computed: {
    emptySlots () {
      if (this.users) {
        return Math.max(this.slots - this.users.length, 0)
      }
      return 0
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
  margin-right .5em
.profilePic
  margin-right .3em
</style>