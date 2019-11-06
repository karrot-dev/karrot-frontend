<template>
  <ChatConversation
    v-if="offer"
    v-bind="mockChatConversationProps"
    compose
    :inline="inline"
  >
    <template v-slot:before-chat-messages>
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
        <pre>{{ offer }}</pre>
        <Markdown :source="offer.description" />
      </div>
    </template>
  </ChatConversation>
</template>

<script>
import { mapGetters } from 'vuex'
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import * as factories from '>/enrichedFactories'
import { QCarousel, QCarouselSlide } from 'quasar'

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
      mockChatConversationProps: createMockChatConversationProps(),
      selectedImageIndex: 0,
    }
  },
  computed: {
    ...mapGetters({
      offer: 'offers/current',
    }),
  },
  watch: {
    offer () {
      this.selectedImageIndex = 0
    },
  },
}
</script>
