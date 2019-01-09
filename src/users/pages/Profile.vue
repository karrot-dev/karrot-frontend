<template>
  <div v-if="user && user.id">
    <Profile
      :user="user"
      :current-group="currentGroup"
      @report="report"
      @detail="detail"
      @createTrust="createTrust"
      @selectGroup="selectGroup"
    />
    <QCard
      v-if="history.length > 0"
    >
      <QCardTitle>
        {{ $t('GROUP.HISTORY') }}
      </QCardTitle>
      <QCardMain>
        <HistoryContainer :history="history" />
      </QCardMain>
    </QCard>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Profile from '@/users/components/ProfileUI'
import HistoryContainer from '@/history/pages/HistoryContainer'
import { QCard, QCardTitle, QCardMain } from 'quasar'

export default {
  components: { QCard, QCardTitle, QCardMain, HistoryContainer, Profile },
  computed: {
    ...mapGetters({
      user: 'users/activeUser',
      currentGroup: 'currentGroup/value',
      history: 'history/byCurrentGroupAndUser',
    }),
  },
  methods: {
    ...mapActions({
      report: 'conflictResolution/report',
      detail: 'detail/openForUser',
      createTrust: 'currentGroup/trustUser',
      selectGroup: 'currentGroup/select',
    }),
  },
}
</script>
