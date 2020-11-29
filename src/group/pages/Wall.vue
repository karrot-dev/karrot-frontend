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
    <pre>testing: {{ testing }}</pre>
    <pre>testing2: {{ testing2 }}</pre>
    <pre>activities: {{ activities }}</pre>
    <pre>foo: {{ foo }}</pre>
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
// eslint-disable-next-line no-unused-vars
import { computed, isReactive, isRef, reactive, ref, toRefs, unref } from '@vue/composition-api'
// eslint-disable-next-line no-unused-vars
import { useActivities, useCachedActivities } from '@/activities/data/useActivities'
import { useEnrichedActivities, useEnrichActivity } from '@/activities/data/useEnrichedActivities'
import { useAuthUser } from '@/activities/data/useAuthUser'
import { useCurrentGroup } from '@/activities/data/useCurrentGroup'
import { useGroupStatus } from '@/activities/data/useStatus'
import { useEnrichedConversation } from '@/activities/data/useEnrichedConversation'
import { useConversation } from '@/activities/data/useConversation'
// eslint-disable-next-line no-unused-vars
import { useCached } from '@/activities/data/useCached'
import { useGlobalUsers } from '@/activities/data/useUsers'

export default {
  components: {
    JoinedActivities,
    AvailableActivities,
    WallConversation,
    FeedbackNotice,
    KSpinner,
  },
  setup () {
    const { currentGroupId: groupId } = useCurrentGroup()
    const { authUserId, authUser: user } = useAuthUser()
    const { getUser } = useGlobalUsers()
    // eslint-disable-next-line no-unused-vars
    const { enrichActivity, enrichActivityFn } = useEnrichActivity({ authUserId, getUser })

    // function enrichActivity (activity) {
    //   return reactive({
    //     ...activity,
    //     description: computed(() => {
    //       return '*' + activity.description
    //     }),
    //   })
    // }

    const { activities, status: activitiesStatus } = useCachedActivities('groupActivities')
    // const { activities, status: activitiesStatus } = useActivities({ groupId, userId: authUserId }, enrichActivity)
    const {
      joinedActivities: joinedActivitiesOriginal,
      availableActivities,
    } = useEnrichedActivities({ activities, authUserId, getUser })

    const { feedbackPossibleCount } = useGroupStatus({ groupId })

    const {
      conversation,
      messages,
      status,
      fetchMore,
      fetchMoreStatus,
      canFetchMore,
    } = useConversation({ groupId })

    const {
      enrichedConversation,
      enrichedMessages,
    } = useEnrichedConversation(conversation, messages, { getUser, authUserId })

    const a = reactive({})
    const b = computed(() => ({}))

    const num = ref(0)

    const testing = reactive({
      num,
      bar: computed(() => {
        return num.value + 1
      }),
    })

    const testing2 = reactive({ ...toRefs(testing) })

    // const testingSpread = Object.assign(testing, reactive({
    //   foo: computed(() => {
    //     return num.value + 1
    //   }),
    // }))

    testing.foo = computed(() => {
      return num.value + 1
    })

    setInterval(() => {
      num.value += 1
    }, 1000)

    const foo = reactive([
      {
        aIsReactive: isReactive(a),
        bIsReactive: isReactive(b),
        aIsRef: isRef(a),
        bIsRef: isRef(b),
      },
      computed(() => {
        return 'a computed value in an array!'
      }),
      computed(() => {
        return {
          woah: 'a computed that returns an object',
        }
      }),
      reactive({
        text: 'some text in a nested reactive!',
      }),
      reactive({
        omg: computed(() => {
          return 'computed inside a reactive inside an array!'
        }),
      }),
      ref('a ref inside an array!'),
    ])

    // const counter = ref(0)
    //
    // setInterval(() => {
    //   counter.value += 1
    // }, 1000)
    //
    // const joinedActivities = computed(() => {
    //   console.log('computing joinedActivities')
    //   return unref(joinedActivitiesOriginal).map(activity => {
    //     return reactive({
    //       ...activity,
    //       description: computed(() => {
    //         console.log('computing activity description', activity.id)
    //         return 'woah ' + unref(counter)
    //       }),
    //     })
    //   })
    // })

    return {
      testing,
      testing2,
      foo,
      user,
      activities,
      conversation: enrichedConversation,
      messages: enrichedMessages,
      fetchStatus: status,
      fetchMore,
      fetchMoreStatus,
      canFetchMore,
      joinedActivities: joinedActivitiesOriginal,
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
