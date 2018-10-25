<template>
  <div v-if="user && user.id">
    <Profile
      :user="user"
      :current-group="currentGroup"
      @detail="detail"
      @createTrust="createTrust"
      @selectGroup="selectGroup"
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
import Profile from '@/users/pages/Profile'
import History from '@/history/components/HistoryList'
import { QCard, QCardTitle, QCardMain } from 'quasar'

export default {
  components: { QCard, QCardTitle, QCardMain, History, Profile },
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
      createTrust: 'currentGroup/trustUser',
      selectGroup: 'currentGroup/select',
    }),
  },
}
</script>
