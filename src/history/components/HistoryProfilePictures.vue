<template>
  <div>
    <ProfilePicture
      v-if="users.length == 1"
      :user="users[0]"
      :size="25"
    />
    <div
      v-else-if="users.length > 1"
      class="usersCount"
      :style="userCountStyle"
    >
      {{ users.length }}
    </div>
  </div>
</template>

<script>
import ProfilePicture from '@/users/components/ProfilePicture'

export default {
  components: { ProfilePicture },
  props: {
    users: { required: true, type: Array },
    size: { default: 25, type: Number },
  },
  computed: {
    userCountStyle () {
      return { width: this.size + 'px', height: this.size + 'px', 'line-height': this.size + 'px' }
    },
  },
}
</script>

<style lang="stylus">
@import '~variables'
.usersCount
  text-align center
  user-select none
</style>
