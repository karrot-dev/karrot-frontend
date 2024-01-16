<template>
  <div>
    <QInfiniteScroll
      v-bind="infiniteScroll"
      :disable="conversation && !hasNextPage"
    >
      <QCard
        v-if="hasLoaded"
        flat
        bordered
        class="desktop-margin"
      >
        <div
          class="actions row"
          style="gap: 3px"
        >
          <MeetButton
            v-if="groupId"
            round
            color="secondary"
            :subject="`group:${groupId}`"
          />
          <NotificationToggle
            :muted="isMuted"
            :is-participant="isParticipant"
            :user="user"
            @set="setNotifications"
          />
        </div>
        <ConversationCompose
          :status="sendStatus"
          :placeholder="messagePrompt"
          :user="user"
          :slim="$q.platform.is.mobile"
          :is-participant="isParticipant"
          :draft-key="conversation.id"
          multiple
          @submit="message => send({ id: conversation.id, ...message })"
        />
      </QCard>
      <QList
        v-if="hasLoaded && messages.length > 0"
        ref="messagesList"
        class="bg-white desktop-margin relative-position q-pb-md rounded-borders"
        bordered
      >
        <QBanner
          v-if="isParticipant && unreadMessageCount > 0"
          class="bg-secondary text-white q-mt-sm"
          style="min-height: unset"
        >
          <template #avatar>
            <QIcon
              name="star"
              color="white"
              size="1.5em"
            />
          </template>
          <div class="row justify-between items-center">
            <small>
              {{ $tc('CONVERSATION.UNREAD_MESSAGES', unreadMessageCount, {
                count: unreadMessageCount > 99 ? '99+' : unreadMessageCount,
              }) }}
            </small>
            <QBtn
              no-caps
              outline
              size="sm"
              @click="() => markAllRead()"
            >
              <span v-t="'CONVERSATION.MARK_READ'" />
            </QBtn>
          </div>
        </QBanner>
        <ConversationMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :is-unread="conversation.seenUpTo && message.id > conversation.seenUpTo"
        />
        <KSpinner v-show="isLoadingMessages || isFetchingNextPage" />
      </QList>
    </QInfiniteScroll>
  </div>
</template>

<script>
import {
  QBtn,
  QInfiniteScroll,
  QList,
  QCard,
  QBanner,
  QIcon,
} from 'quasar'
import { computed, toRefs } from 'vue'

import { useAuthService } from '@/authuser/services'
import { useConversationHelpers } from '@/messages/helpers'
import {
  useConversationSeenUpToMutation,
  useSaveConversationMutation,
  useSendMessageMutation,
} from '@/messages/mutations'
import { useConversationQuery, useMessageListQuery } from '@/messages/queries'

import MeetButton from '@/meet/components/MeetButton.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

import ConversationCompose from './ConversationCompose.vue'
import ConversationMessage from './ConversationMessage.vue'
import NotificationToggle from './NotificationToggle.vue'

export default {
  name: 'WallConversation',
  components: {
    MeetButton,
    ConversationMessage,
    ConversationCompose,
    NotificationToggle,
    KSpinner,
    QBtn,
    QInfiniteScroll,
    QList,
    QCard,
    QBanner,
    QIcon,
  },
  props: {
    groupId: {
      type: Number,
      default: null,
    },
    placeId: {
      type: Number,
      default: null,
    },
  },
  setup (props) {
    const { user } = useAuthService()

    const {
      groupId,
      placeId,
    } = toRefs(props)

    const {
      getUnreadMessageCount,
      getIsParticipant,
      getIsMuted,
    } = useConversationHelpers()

    const {
      conversation,
      isLoading: isLoadingConversation,
    } = useConversationQuery({ groupId, placeId })

    const conversationId = computed(() => conversation.value?.id)
    const {
      messages,
      isLoading: isLoadingMessages,
      isFetching,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
      infiniteScroll,
    } = useMessageListQuery(
      { conversationId },
      { order: 'newest-first' },
    )

    const {
      mutate: send,
      status: sendStatus,
    } = useSendMessageMutation()
    const { mutate: saveConversation } = useSaveConversationMutation()
    const { mutate: markSeenUpTo } = useConversationSeenUpToMutation()

    function markAllRead () {
      const messageId = messages.value?.[0]?.id
      if (conversationId.value && messageId) {
        markSeenUpTo({ conversationId: conversationId.value, messageId })
      }
    }

    function setNotifications (value) {
      saveConversation({
        id: conversationId.value,
        value,
      })
    }

    return {
      user,
      conversation,
      isLoadingConversation,

      unreadMessageCount: computed(() => getUnreadMessageCount(conversation.value)),
      isParticipant: computed(() => getIsParticipant(conversation.value)),
      isMuted: computed(() => getIsMuted(conversation.value)),

      messages,
      infiniteScroll,
      isLoadingMessages,
      hasNextPage,
      fetchNextPage,
      isFetching,
      isFetchingNextPage,

      send,
      sendStatus,

      markAllRead,
      setNotifications,
    }
  },
  computed: {
    hasLoaded () {
      return !this.isLoadingConversation && !this.isLoadingMessages
    },
    messagePrompt () {
      if (!this.conversation) return ''
      if (this.messages.length > 0) {
        return this.$t('WALL.WRITE_MESSAGE')
      }
      else {
        return this.$t('WALL.WRITE_FIRST_MESSAGE')
      }
    },
  },
  watch: {
    hasLoaded (val) {
      if (val) {
        const hash = this.$route.hash
        if (hash === '#messages') {
          const ref = this.$refs.messagesList
          if (ref) ref.$el.scrollIntoView()
        }
      }
    },
  },
}
</script>

<style scoped lang="sass">
.actions
  position: absolute
  top: -32px
  right: 6px
  z-index: 1

::v-deep(.q-banner__avatar)
  align-self: center
</style>
