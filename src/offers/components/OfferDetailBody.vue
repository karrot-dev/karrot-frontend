<template>
  <ChatConversation
    v-if="conversation"
    :conversation="conversationWithReversedMessages"
    :away="away"
    :current-user="currentUser"
    compose
    :inline="inline"
    @mark="mark"
    @toggleReaction="toggleReaction"
    @saveMessage="saveMessage"
    @fetchPast="fetchPast"
    @send="send"
  >
    <template
      v-if="offer"
      #before-chat-messages
    >
      <QCarousel
        v-model="selectedImageIndex"
        swipeable
        animated
        thumbnails
        arrows
        infinite
      >
        <QCarouselSlide
          v-for="(image, idx) in offer.images"
          :key="image.id"
          :name="idx"
          :img-src="image.imageUrls.fullSize"
        />
      </QCarousel>
      <div class="q-ma-md">
        <Markdown :source="offer.description" />
      </div>
    </template>
  </ChatConversation>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import { QCarousel, QCarouselSlide } from 'quasar'

export default {
  components: {
    QCarousel,
    QCarouselSlide,
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
      selectedImageIndex: 0,
    }
  },
  computed: {
    ...mapGetters({
      offer: 'offers/current',
      conversation: 'offers/currentConversation',
      away: 'presence/toggle/away',
      currentUser: 'auth/user',
    }),
    conversationWithReversedMessages () {
      return {
        ...this.conversation,
        messages: this.conversation.messages.slice().reverse(),
      }
    },
  },
  watch: {
    offer () {
      this.selectedImageIndex = 0
    },
  },
  methods: {
    ...mapActions({
      send: 'conversations/send',
      saveMessage: 'conversations/saveMessage',
      mark: 'conversations/maybeMark',
      setMuted: 'conversations/maybeSetMuted',
      toggleReaction: 'conversations/toggleReaction',
      fetchPast: 'conversations/fetchPast',
      saveConversation: 'conversations/maybeSave',
    }),
  },
}
</script>
