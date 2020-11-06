<template>
  <div class="wrapper">
    <div class="notices">
      <KSpinner v-show="fetchingActivities" />
      <div v-if="joinedActivities.length > 0">
        <JoinedActivities
          :activities="joinedActivities"
          @detail="detail"
        />
      </div>
      <div v-if="availableActivities.length > 0">
        <AvailableActivities
          :activities="availableActivities"
          @detail="detail"
        />
      </div>
      <FeedbackNotice
        v-if="feedbackPossible.length > 0"
        :feedback-possible="feedbackPossible"
      />
    </div>
    <WallConversation
      :data="conversation"
      :user="user"
      :fetch-past="fetchPast"
      @send="send"
      @save-message="saveMessage"
      @mark-all-read="markAllRead"
      @save-conversation="saveConversation"
      @toggle-reaction="toggleReaction"
      @open-thread="openThread"
    />
  </div>
</template>

<script>
import AvailableActivities from '@/group/components/AvailableActivities'
import FeedbackNotice from '@/group/components/FeedbackNotice'
import JoinedActivities from '@/group/components/JoinedActivities'
import WallConversation from '@/messages/components/WallConversation'
import KSpinner from '@/utils/components/KSpinner'

import { mapGetters, mapActions } from 'vuex'
import { useEnrichedUsers, useGlobalUsers } from '@/activities/data/useUsers'
import { useCachedActivities } from '@/activities/data/useActivities'
import { useEnrichedActivities } from '@/activities/data/useEnrichedActivities'
import { useAuthUser } from '@/activities/data/useAuthUser'

export default {
  components: {
    JoinedActivities,
    AvailableActivities,
    WallConversation,
    FeedbackNotice,
    KSpinner,
  },
  setup () {
    const { authUserId, authUser: user } = useAuthUser()
    const { getUser } = useGlobalUsers()
    const { activities, status } = useCachedActivities('groupActivities')
    const { enrichUser } = useEnrichedUsers({ authUserId })
    const {
      joinedActivities,
      availableActivities,
      feedbackPossibleActivities,
    } = useEnrichedActivities({ activities, authUserId, getUser, enrichUser })
    return {
      user,
      joinedActivities,
      availableActivities,
      feedbackPossible: feedbackPossibleActivities,
      fetchingActivities: status.pending,
    }
  },
  computed: {
    ...mapGetters({
      // joinedActivities: 'activities/joined',
      // availableActivities: 'activities/available',
      // fetchingActivities: 'activities/fetchingForCurrentGroup',
      // feedbackPossible: 'activities/feedbackPossibleByCurrentGroup',
      // feedbackPossibleStatus: 'activities/fetchFeedbackPossibleStatus',
      conversation: 'currentGroup/conversation',
      // user: 'auth/user',
    }),
  },
  methods: {
    ...mapActions({
      // join: 'activities/join',
      // leave: 'activities/leave',
      detail: 'detail/openForActivity',
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
