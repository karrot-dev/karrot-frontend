<template>
  <div>
    <WallConversation
      class="q-pt-lg"
      :data="conversation"
      :user="currentUser"
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
import { mapGetters, mapActions } from 'vuex'
import WallConversation from '@/messages/components/WallConversation'

export default {
  components: {
    WallConversation,
  },
  computed: {
    ...mapGetters({
      conversation: 'places/conversation',
      currentUser: 'auth/user',
    }),
  },
  methods: {
    ...mapActions({
      openThread: 'detail/openForThread',
      send: 'conversations/send',
      saveMessage: 'conversations/saveMessage',
      saveConversation: 'conversations/maybeSave',
      markAllRead: 'conversations/markAllRead',
      toggleReaction: 'conversations/toggleReaction',
      fetchPast: 'conversations/fetchPast',
    }),
  },
}
</script>
