<template>
  <div class="wrapper">
    <div class="notices">
      <KSpinner v-show="fetchingActivities || feedbackPossibleStatus.pending" />
      <div v-if="joinedActivities.length > 0">
        <JoinedActivities
          :activities="joinedActivities"
          @join="join"
          @leave="leave"
          @detail="detail"
        />
      </div>
      <div v-if="availableActivities.length > 0">
        <AvailableActivities
          :activities="availableActivities"
          @join="join"
          @leave="leave"
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
import { useEnrichedUsers } from '@/activities/data/useUsers'
// eslint-disable-next-line no-unused-vars
import { useActivities, useCachedActivities } from '@/activities/data/useActivities'
import { useGlobal } from '@/activities/data/useGlobal'
import { useEnrichedActivities } from '@/activities/data/useEnrichedActivities'
// eslint-disable-next-line no-unused-vars
import { onUnmounted, unref, watchEffect } from '@vue/composition-api'
// eslint-disable-next-line no-unused-vars
import { useCache } from '@/activities/data/useCached'

export default {
  components: {
    JoinedActivities,
    AvailableActivities,
    WallConversation,
    FeedbackNotice,
    KSpinner,
  },
  setup () {
    const { getUser, currentGroupId, authUserId } = useGlobal()

    // caching fucked for now!
    // const { activities, status } = useCachedActivities(
    //   'group',
    //   { groupId: currentGroupId },
    // )

    const { activities, status } = useActivities({ groupId: currentGroupId })

    const { enrichUser } = useEnrichedUsers({ authUserId })
    const {
      joinedActivities,
      availableActivities,
      feedbackPossibleActivities,
    } = useEnrichedActivities({ activities, authUserId, getUser, enrichUser })

    watchEffect(() => {
      console.log('we have', unref(joinedActivities).length, 'joined activities (y)')
    })

    // const { cache } = useCache()
    //
    // onUnmounted(() => {
    //   console.log('restting cache is unmounted!')
    //   cache.reset()
    // })

    return {
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
      feedbackPossibleStatus: 'activities/fetchFeedbackPossibleStatus',
      conversation: 'currentGroup/conversation',
      user: 'auth/user',
    }),
  },
  methods: {
    ...mapActions({
      join: 'activities/join',
      leave: 'activities/leave',
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
