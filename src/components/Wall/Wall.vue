<template>
  <div class="wrapper">
    <div class="notices">
      <div v-if="joinedPickups.length > 0">
        <JoinedPickups
          :pickups="joinedPickups"
          @join="$emit('join', arguments[0])"
          @leave="$emit('leave', arguments[0])"
        />
      </div>
      <div v-if="availablePickups.length > 0">
        <AvailablePickups
          :pickups="availablePickups"
          @join="$emit('join', arguments[0])"
          @leave="$emit('leave', arguments[0])"
        />
      </div>
      <FeedbackNotice/>
    </div>
    <Conversation
      :data="conversation"
      :user="user"
      :fetch-more="fetchMore"
      @send="$emit('send', arguments[0])"
    />
  </div>
</template>

<script>
import AvailablePickups from './AvailablePickups'
import FeedbackNotice from './FeedbackNotice'
import JoinedPickups from './JoinedPickups'
import Conversation from '@/components/Conversation/Conversation'

export default {
  components: {
    JoinedPickups,
    AvailablePickups,
    Conversation,
    FeedbackNotice,
  },
  props: {
    joinedPickups: { required: true },
    availablePickups: { required: true },
    conversation: { required: true },
    fetchMore: { required: true },
    user: { required: true },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.notices
  margin-top .5em
  margin-bottom 3em
</style>
