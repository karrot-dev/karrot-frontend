<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


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
