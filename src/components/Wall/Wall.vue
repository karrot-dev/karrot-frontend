<template>
  <component
    :is="$q.platform.is.mobile ? 'q-pull-to-refresh' : 'div'"
    :handler="refresh"
    style="max-height: none"
  >
    <div class="wrapper">
      <div class="notices">
        <div v-if="joinedPickups.length > 0">
          <JoinedPickups
            :pickups="joinedPickups"
            @join="$emit('join', arguments[0])"
            @leave="$emit('leave', arguments[0])"
            @detail="$emit('detail', arguments[0])"
          />
        </div>
        <div v-if="availablePickups.length > 0">
          <AvailablePickups
            :pickups="availablePickups"
            @join="$emit('join', arguments[0])"
            @leave="$emit('leave', arguments[0])"
          />
        </div>
        <FeedbackNotice
          v-if="feedbackPossible.length > 0"
          :feedback-possible="feedbackPossible"
        />
      </div>
      <Conversation
        :data="conversation"
        :user="user"
        :fetch-more="fetchMore"
        @send="$emit('send', arguments[0])"
        @saveMessage="$emit('saveMessage', arguments[0])"
        @markAllRead="$emit('markAllRead', arguments[0])"
        @toggleEmailNotifications="$emit('toggleEmailNotifications', arguments[0])"
        @toggleReaction="$emit('toggleReaction', arguments[0])"
      />
    </div>
  </component>
</template>

<script>
import AvailablePickups from './AvailablePickups'
import FeedbackNotice from './FeedbackNotice'
import JoinedPickups from './JoinedPickups'
import Conversation from '@/components/Conversation/Conversation'
import { QPullToRefresh } from 'quasar'
import { refresh } from '@/store/storeHelpers'

export default {
  components: {
    JoinedPickups,
    AvailablePickups,
    Conversation,
    FeedbackNotice,
    QPullToRefresh,
  },
  methods: {
    async refresh (done) {
      await refresh()
      done()
    },
  },
  props: {
    joinedPickups: { required: true, type: Array },
    availablePickups: { required: true, type: Array },
    feedbackPossible: { required: true, type: Array },
    conversation: { required: true, type: Object },
    fetchMore: { required: true, type: Function },
    user: { default: null, type: Object },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.notices
  margin-top .5em
  margin-bottom 3em
</style>
