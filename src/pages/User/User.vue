<template>
  <div v-if="user && user.id">
    <UserProfile :user="user" :groups="groups" />
    <History show-title />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserProfile from '@/components/User/Profile'
import History from '@/pages/History'

export default {
  components: { History, UserProfile },
  computed: {
    ...mapGetters({
      user: 'users/activeUser',
      groups: 'groups/activeUserGroups',
    }),
  },
}
</script>

<style scoped lang="stylus">

</style>
