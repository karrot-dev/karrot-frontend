<template>
  <div>
    <ProfilePicture
      v-for="user in users"
      :key="user.id"
      :user="user"/>
  </div>
</template>

<script>
import ProfilePicture from './ProfilePicture.vue'

export default {
  props: {
    users: {
      required: true
    }
  },
  components: {
    ProfilePicture
  }
}
</script>

<style scoped lang="stylus">
</style>