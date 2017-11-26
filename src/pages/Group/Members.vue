<template>
  <div>
    <q-card class="no-shadow grey-border" style="width: 100%">
      <UserList :users="users" />
    </q-card>
  </div>
</template>

<script>
import { QCard } from 'quasar'
import UserList from '@/components/ProfilePictures/UserList'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { UserList, QCard },
  computed: {
    ...mapGetters({
      users: 'users/byCurrentGroup',
    }),
  },
}
</script>

<style scoped lang="stylus">
.wrapper
  margin 1em
</style>
