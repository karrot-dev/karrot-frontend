<template>
  <div
    v-if="item"
    class="absolute-full column"
  >
    <div class="col-auto">
      <QToolbar
        class="bg-secondary text-white"
      >
        <QToolbarTitle
          class="column"
        >
          <div>{{ item.name }}</div>
        </QToolbarTitle>
        <QBtn
          v-if="!$q.platform.is.mobile"
          flat
          round
          dense
          icon="close"
          :title="$t('BUTTON.CLOSE')"
          @click="close()"
        />
      </QToolbar>
    </div>
    <div class="col relative-position">
      <ChatConversation
        v-bind="mockChatConversationProps"
        compose
        inline
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { QBtn, QToolbar, QToolbarTitle } from 'quasar'
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
    QBtn,
    QToolbar,
    QToolbarTitle,
  },
  data () {
    return {
      mockChatConversationProps: createMockChatConversationProps(),
    }
  },
  computed: {
    ...mapGetters({
      item: 'offerItems/current',
    }),
  },
  methods: {
    close () {
      this.$router.push({ name: 'groupOffers' })
    },
  },
}
</script>

<style scoped lang="stylus">
  .photo
    width 100%
</style>
