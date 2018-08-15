<template>
  <div v-if="user && user.id">
    <UserProfile
      :user="user"
      :groups="user.groups"
      :current-group="currentGroup"
      @detail="detail"
    />
    <Memberships
      :user="user"
      @createTrust="createTrust"
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
import Memberships from '@/components/User/Memberships'
import History from '@/components/History/HistoryList'
import { QCard, QCardTitle, QCardMain } from 'quasar'

export default {
  components: { QCard, QCardTitle, QCardMain, History, UserProfile, Memberships },
  computed: {
    ...mapGetters({
      user: 'users/activeUser',
      currentGroup: 'currentGroup/value',
    }),
  },
  methods: {
    ...mapActions({
      detail: 'detail/openForUser',
      createTrust: 'groups/trustUser',
    }),
  },
}
</script>

<style scoped lang="stylus">

</style>
