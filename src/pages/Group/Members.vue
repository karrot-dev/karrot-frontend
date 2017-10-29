<template>
  <div class="grey-border wrapper">
    <UserList :users="users" />
  </div>
</template>

<script>
import UserList from '@/components/ProfilePictures/UserList'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { UserList },
  computed: {
    ...mapGetters({
      users: 'users/byActiveGroup',
    }),
  },
}
</script>

<style scoped lang="stylus">
.wrapper
  margin 1em
</style>
