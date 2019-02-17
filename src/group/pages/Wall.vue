<template>
  <div class="wrapper">
    <div class="notices">
      <div
        v-show="fetchingPickups || feedbackPossibleStatus.pending || applicationStatus.pending"
        style="width: 100%; text-align: center"
      >
        <QSpinnerDots :size="40"/>
      </div>
      <div v-if="joinedPickups.length > 0">
        <JoinedPickups
          :pickups="joinedPickups"
          @join="join"
          @leave="leave"
          @detail="detail"
        />
      </div>
      <div v-if="availablePickups.length > 0">
        <AvailablePickups
          :pickups="availablePickups"
          @join="join"
          @leave="leave"
          @detail="detail"
        />
      </div>
      <FeedbackNotice
        v-if="feedbackPossible.length > 0"
        :feedback-possible="feedbackPossible"
      />
      <PendingApplications
        v-if="applications.length > 0"
        :applications="applications"
      />
    </div>
    <WallConversation
      :data="conversation"
      :user="user"
      :fetch-past="fetchPast"
      @send="send"
      @saveMessage="saveMessage"
      @markAllRead="markAllRead"
      @saveConversation="saveConversation"
      @toggleReaction="toggleReaction"
      @openThread="openThread"
    />
  </div>
</template>

<script>
import AvailablePickups from '@/group/components/AvailablePickups'
import FeedbackNotice from '@/group/components/FeedbackNotice'
import JoinedPickups from '@/group/components/JoinedPickups'
import PendingApplications from '@/group/components/PendingApplications'
import WallConversation from '@/messages/components/WallConversation'

import { mapGetters, mapActions } from 'vuex'

import {
  QSpinnerDots,
} from 'quasar'

export default {
  components: {
    JoinedPickups,
    AvailablePickups,
    WallConversation,
    FeedbackNotice,
    PendingApplications,
    QSpinnerDots,
  },
  computed: {
    ...mapGetters({
      joinedPickups: 'pickups/joined',
      availablePickups: 'pickups/available',
      fetchingPickups: 'pickups/fetchingForCurrentGroup',
      feedbackPossible: 'pickups/feedbackPossibleByCurrentGroup',
      feedbackPossibleStatus: 'pickups/fetchFeedbackPossibleStatus',
      applications: 'applications/forCurrentGroupPending',
      applicationStatus: 'applications/fetchPendingByGroupIdStatus',
      conversation: 'currentGroup/conversation',
      user: 'auth/user',
    }),
  },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
      detail: 'detail/openForPickup',
      openThread: 'detail/openForThread',
      send: 'conversations/send',
      saveMessage: 'conversations/saveMessage',
      markAllRead: 'conversations/markAllRead',
      saveConversation: 'conversations/maybeSave',
      toggleReaction: 'conversations/toggleReaction',
      fetchPast: 'conversations/fetchPast',
    }),
  },
}
</script>

<style scoped lang="stylus">
.notices
  margin-top .5em
  margin-bottom 3em
</style>
