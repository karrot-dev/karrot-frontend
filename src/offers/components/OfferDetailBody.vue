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
          :img-src="image.imageUrls['600']"
        />
      </QCarousel>
      <div
        v-if="!isDefaultStatus"
        class="q-pa-md text-center text-h6 text-white"
        :class="`bg-${offer.status === 'accepted' ? 'positive' : 'negative'}`"
      >
        {{ offer.status }}
      </div>
      <div
        v-if="offer.canEdit && offer.status === 'active'"
        class="row justify-end"
      >
        <QBtnDropdown
          flat
          no-caps
          :label="$t('OFFER.MARK_AS_ACCEPTED')"
        >
          <div
            class="q-pa-lg"
            style="max-width: 300px;"
          >
            <div
              v-t="'OFFER.MARK_AS_ACCEPTED_DESCRIPTION'"
              class="text-body1 q-mb-lg"
            />
            <div class="row justify-end">
              <QBtn
                color="positive"
                @click="accept({ offerId: offer.id })"
              >
                <span v-t="'OFFER.MARK_AS_ACCEPTED'" />
              </QBtn>
            </div>
          </div>
        </QBtnDropdown>
        <QBtnDropdown
          flat
          no-caps
          :label="$t('OFFER.MARK_AS_ARCHIVED')"
        >
          <div
            class="q-pa-lg"
            style="max-width: 300px;"
          >
            <div
              v-t="'OFFER.MARK_AS_ARCHIVED_DESCRIPTION'"
              class="text-body1 q-mb-lg"
            />
            <div class="row justify-end">
              <QBtn
                color="negative"
                @click="archive({ offerId: offer.id })"
              >
                <span v-t="'OFFER.MARK_AS_ARCHIVED'" />
              </QBtn>
            </div>
          </div>
        </QBtnDropdown>
      </div>
      <div class="q-ma-md q-pa-md bg-white grey-border">
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
import { QBtn, QBtnDropdown, QCarousel, QCarouselSlide } from 'quasar'
import { DEFAULT_STATUS } from '@/offers/datastore/offers'

export default {
  components: {
    QBtn,
    QBtnDropdown,
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
    isDefaultStatus () {
      return this.offer.status === DEFAULT_STATUS
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
