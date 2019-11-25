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
        v-if="offer.images.length > 0"
        v-model="selectedImageIndex"
        v-bind="carouselOptions"
      >
        <QCarouselSlide
          v-for="(image, idx) in offer.images"
          :key="image.id"
          :name="idx"
          :img-src="image.imageUrls.fullSize"
        />
      </QCarousel>
      <div
        v-if="offer.status !== defaultStatus"
        class="q-pa-md text-center bg-accent text-h6"
      >
        {{ offer.status }}
      </div>
      <div
        v-if="offer.canEdit && offer.status === 'active'"
        class="row"
      >
        <QBtn
          color="primary"
          class="q-ma-md col"
          @click="accept({ offerId: offer.id })"
        >
          Mark as accepted
        </QBtn>
        <QBtn
          color="red"
          class="q-ma-md col"
          @click="archive({ offerId: offer.id })"
        >
          Archive
        </QBtn>
      </div>
      <div class="q-pa-md bg-white">
        <Markdown :source="offer.description" />
      </div>
    </template>
  </ChatConversation>
  <KSpinner v-else />
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import KSpinner from '@/utils/components/KSpinner'
import { QBtn, QCarousel, QCarouselSlide } from 'quasar'
import { DEFAULT_STATUS } from '@/offers/datastore/offers'

export default {
  components: {
    QBtn,
    QCarousel,
    QCarouselSlide,
    ChatConversation,
    Markdown,
    KSpinner,
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
      defaultStatus: DEFAULT_STATUS,
    }
  },
  computed: {
    ...mapGetters({
      offer: 'currentOffer/value',
      conversation: 'currentOffer/conversation',
      away: 'presence/toggle/away',
      currentUser: 'auth/user',
    }),
    conversationWithReversedMessages () {
      return {
        ...this.conversation,
        messages: this.conversation.messages.slice().reverse(),
      }
    },
    carouselOptions () {
      if (this.offer.images.length <= 1) return
      return {
        swipeable: true,
        animated: true,
        thumbnails: true,
        arrows: true,
        infinite: true,
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
      accept: 'offers/accept',
      archive: 'offers/archive',
    }),
  },
}
</script>
