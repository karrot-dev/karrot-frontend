<template>
  <ChatConversation
    v-if="item"
    v-bind="mockChatConversationProps"
    compose
    :inline="inline"
  >
    <template v-slot:before-chat-messages>
      <div class="photo">
        <img
          :src="item.photoUrls.fullSize"
          class="full-width"
        >
      </div>
      <div class="q-ma-md">
        <Markdown :source="item.description" />
      </div>
    </template>
  </ChatConversation>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import * as factories from '>/enrichedFactories'

const createMockChatConversationProps = data => ({
  currentUser: factories.makeCurrentUser(),
  conversation: factories.makeConversation({
    unreadMessageCount: 1,
  }),
  away: false,
  ...data,
})

export default {
  components: {
    ChatConversation,
    Markdown,
  },
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      mockChatConversationProps: createMockChatConversationProps(),
    }
  },
  computed: {
    ...mapGetters({
      item: 'offers/current',
    }),
  },
}
</script>

<style scoped lang="stylus">
  .photo
    width 100%
</style>
