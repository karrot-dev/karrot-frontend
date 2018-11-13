<template>
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
      <PendingApplications
        v-if="applications.length > 0"
        :applications="applications"
      />
    </div>
    <WallConversation
      :data="conversation"
      :user="user"
      :fetch-past="fetchPast"
      @send="$emit('send', arguments[0])"
      @saveMessage="$emit('saveMessage', arguments[0])"
      @markAllRead="$emit('markAllRead', arguments[0])"
      @toggleEmailNotifications="$emit('toggleEmailNotifications', arguments[0])"
      @toggleReaction="$emit('toggleReaction', arguments[0])"
      @openThread="$emit('openThread', arguments[0])"
    />
  </div>
</template>

<script>
import AvailablePickups from './AvailablePickups'
import FeedbackNotice from './FeedbackNotice'
import JoinedPickups from './JoinedPickups'
import PendingApplications from './PendingApplications'
import WallConversation from '@/messages/components/WallConversation'

export default {
  components: {
    JoinedPickups,
    AvailablePickups,
    WallConversation,
    FeedbackNotice,
    PendingApplications,
  },
  props: {
    joinedPickups: { required: true, type: Array },
    availablePickups: { required: true, type: Array },
    feedbackPossible: { required: true, type: Array },
    applications: { required: true, type: Array },
    conversation: { required: true, type: Object },
    fetchPast: { required: true, type: Function },
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
