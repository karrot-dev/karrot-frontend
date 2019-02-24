<template>
  <div v-if="user && user.id">
    <Profile
      :user="user"
      :current-group="currentGroup"
      @detail="detail"
      @createTrust="createTrust"
      @selectGroup="selectGroup"
    />
    <KSpinner v-show="historyStatus.pending" />
    <QCard v-if="history.length > 0">
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
import KSpinner from '@/utils/components/KSpinner'
import {
  QCard,
  QCardTitle,
  QCardMain,
} from 'quasar'

export default {
  components: {
    Profile,
    HistoryContainer,
    KSpinner,
    QCard,
    QCardTitle,
    QCardMain,
  },
  computed: {
    ...mapGetters({
      user: 'users/activeUser',
      currentGroup: 'currentGroup/value',
      history: 'history/byCurrentGroupAndUser',
      historyStatus: 'history/fetchStatus',
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
