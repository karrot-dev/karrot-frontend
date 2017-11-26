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
      <div v-if="emptyPickups.length > 0">
        <EmptyPickups
          :pickups="emptyPickups"
          @join="$emit('join', arguments[0])"
          @leave="$emit('leave', arguments[0])"
        />
      </div>
    </div>
    <Conversation
      :data="conversation"
      :user="user"
      :fetchMore="fetchMore"
      @send="$emit('send', arguments[0])"
    />
  </div>
</template>

<script>
import EmptyPickups from './EmptyPickups'
import JoinedPickups from './JoinedPickups'
import Conversation from '@/components/Conversation/Conversation'

export default {
  components: {
    JoinedPickups,
    EmptyPickups,
    Conversation,
  },
  props: {
    joinedPickups: { required: true },
    emptyPickups: { required: true },
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
