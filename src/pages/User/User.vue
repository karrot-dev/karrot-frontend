<template>
  <div v-if="user && user.id">
    <UserProfile
      :user="user"
      :groups="groups"
      @detail="detail"
    />
    <q-card class="no-shadow grey-border">
      <q-card-title>
        {{ $t('GROUP.HISTORY') }}
      </q-card-title>
      <q-card-main>
        <History />
      </q-card-main>
    </q-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UserProfile from '@/components/User/Profile'
import History from '@/components/History/HistoryList'
import { QCard, QCardTitle, QCardMain } from 'quasar'

export default {
  components: { QCard, QCardTitle, QCardMain, History, UserProfile },
  computed: {
    ...mapGetters({
      user: 'users/activeUser',
      groups: 'groups/activeUserGroups',
    }),
  },
  methods: {
    ...mapActions({
      detail: 'detail/openForUser',
    }),
  },
}
</script>

<style scoped lang="stylus">

</style>
