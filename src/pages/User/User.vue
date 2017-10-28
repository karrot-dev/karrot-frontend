<template>
  <div v-if="user">
    <UserProfile :user="user" :groups="groups" />
    <q-card>
      <q-card-title>History</q-card-title>
      <History :user="user" />
    </q-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserProfile from '@/components/User/Profile'
import History from '@/components/History/HistoryList.vue'
import { QCard, QCardTitle } from 'quasar'

export default {
  components: { History, UserProfile, QCard, QCardTitle },
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
