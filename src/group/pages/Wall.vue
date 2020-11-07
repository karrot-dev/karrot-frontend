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
        v-if="feedbackPossibleCount > 0"
        :feedback-possible-count="feedbackPossibleCount"
      />
    </div>
    <!--<pre>messages: {{ messages[messages.length - 1] }}</pre>-->
    <WallConversation
      :conversation="conversation"
      :messages="messages"
      :user="user"
      :fetch-status="fetchStatus"
      :fetch-past="fetchMore"
      :fetch-past-status="fetchMoreStatus"
      :can-fetch-past="canFetchMore"
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
import { useCurrentGroup } from '@/activities/data/useCurrentGroup'
import { useGroupStatus } from '@/activities/data/useStatus'
import { watch, ref } from '@vue/composition-api'
import { useEnrichedConversation } from '@/activities/data/useEnrichedConversation'

export default {
  components: {
    JoinedActivities,
    AvailableActivities,
    WallConversation,
    FeedbackNotice,
    KSpinner,
  },
  setup (props, { root }) {
    const { currentGroupId: groupId } = useCurrentGroup()
    const { authUserId, authUser: user } = useAuthUser()
    const { getUser } = useGlobalUsers()
    const { activities, status: activitiesStatus } = useCachedActivities('groupActivities')
    const { enrichUser } = useEnrichedUsers({ authUserId })
    const {
      joinedActivities,
      availableActivities,
    } = useEnrichedActivities({ activities, authUserId, getUser, enrichUser })
    const { feedbackPossibleCount } = useGroupStatus({ groupId })
    const conversationId = ref(null)
    watch(() => root.$store.getters['currentGroup/conversation'], conversation => {
      if (conversation) {
        conversationId.value = conversation.id
      }
      else {
        conversationId.value = null
      }
    }, { immediate: true })
    const {
      conversation,
      messages,
      status,
      fetchMore,
      fetchMoreStatus,
      canFetchMore,
    } = useEnrichedConversation({ conversationId, getUser, authUserId })
    return {
      user,
      conversation,
      messages,
      fetchStatus: status,
      fetchMore,
      fetchMoreStatus,
      canFetchMore,
      joinedActivities,
      availableActivities,
      feedbackPossibleCount,
      fetchingActivities: activitiesStatus.pending,
    }
  },
  computed: {
    ...mapGetters({
      // joinedActivities: 'activities/joined',
      // availableActivities: 'activities/available',
      // fetchingActivities: 'activities/fetchingForCurrentGroup',
      // feedbackPossible: 'activities/feedbackPossibleByCurrentGroup',
      // feedbackPossibleStatus: 'activities/fetchFeedbackPossibleStatus',
      // conversation: 'currentGroup/conversation',
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
