<template>
  <div>
    <QInfiniteScroll
      :disable="conversation && !hasNextPage"
      @load="infiniteScrollLoad"
    >
      <QList
        ref="messagesList"
        class="bg-white desktop-margin relative-position q-pb-md"
        bordered
      >
        <template v-if="hasLoaded">
          <NotificationToggle
            class="actionButton"
            :muted="isMuted"
            :is-participant="isParticipant"
            :user="user"
            @set="setNotifications"
          />
          <ConversationCompose
            :status="sendStatus"
            :placeholder="messagePrompt"
            :user="user"
            :slim="$q.platform.is.mobile"
            :is-participant="isParticipant"
            :draft-key="conversation.id"
            @submit="message => send({ id: conversation.id, ...message })"
          />
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
            :is-unread="message.id > conversation.seenUpTo"
          />
        </template>
        <KSpinner v-show="isLoadingMessages || isFetchingNextPage" />
      </QList>
    </QInfiniteScroll>
  </div>
</template>

<script>
import { computed, toRefs } from 'vue'

import {
  QBtn,
  QInfiniteScroll,
  QList,
  QBanner,
  QIcon,
} from 'quasar'

import ConversationMessage from './ConversationMessage'
import ConversationCompose from './ConversationCompose'
import NotificationToggle from './NotificationToggle'
import KSpinner from '@/utils/components/KSpinner'

import {
  useConversationSeenUpToMutation,
  useSaveConversationMutation,
  useSendMessageMutation,
} from '@/messages/mutations'
import { useConversationQuery, useMessageListQuery } from '@/messages/queries'
import { useConversationHelpers } from '@/messages/helpers'

export default {
  name: 'WallConversation',
  components: {
    ConversationMessage,
    ConversationCompose,
    NotificationToggle,
    KSpinner,
    QBtn,
    QInfiniteScroll,
    QList,
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
    user: {
      type: Object,
      default: null,
    },
  },
  setup (props) {
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
      isFetchingNextPage, // TODO: this is not being passed into component yet...
      infiniteScrollLoad,
    } = useMessageListQuery({ conversationId })

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
      conversation,
      isLoadingConversation,

      unreadMessageCount: computed(() => getUnreadMessageCount(conversation.value)),
      isParticipant: computed(() => getIsParticipant(conversation.value)),
      isMuted: computed(() => getIsMuted(conversation.value)),

      messages,
      // messages: computed(() => messages.value.map(enrichMessage)),
      infiniteScrollLoad,
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
      if (!this.conversation) return false
      return !this.pending
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
.actionButton
  position: absolute
  top: -32px
  right: 6px
  z-index: 1

::v-deep(.q-banner__avatar)
  align-self: center
</style>
