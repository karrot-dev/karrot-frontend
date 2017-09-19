<template>
  <div class="shadow-1 wrapper">
    <UserList :users="users" />
  </div>
</template>

<script>
import UserList from '@/components/ProfilePictures/UserList.vue'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { UserList },
  computed: {
    ...mapGetters({
      users: 'groups/activeUsers',
    }),
  },
  metaInfo () {
    if (this.group) {
      return {
        title: this.group.name,
      }
    }
    else {
      return {}
    }
  },
}
</script>

<style scoped lang="stylus">
.wrapper
  margin 1em
  background-color white
</style>
