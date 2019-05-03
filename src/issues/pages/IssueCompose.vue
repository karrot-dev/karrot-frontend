<template>
  <ConversationComposeContainer
    :conversation="conversation"
  />
</template>

<script>
import ConversationComposeContainer from './ConversationComposeContainer'

import { mapGetters } from 'vuex'

export default {
  components: {
    ConversationComposeContainer,
  },
  computed: {
    ...mapGetters({
      conversation: 'issues/currentConversation',
    }),
  },
}
</script>
