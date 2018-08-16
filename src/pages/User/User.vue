<template>
  <div v-if="user && user.id">
    <UserProfile
      :user="user"
      :groups="user.groups"
      :current-group="currentGroup"
      @detail="detail"
      @createTrust="createTrust"
    />
    <q-card
      v-if="history.length > 0"
    >
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
      currentGroup: 'currentGroup/value',
      history: 'history/all',
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
