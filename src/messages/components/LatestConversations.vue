<template>
  <div
    class="bg-white relative-position"
  >
    <KSpinner v-show="isLoading" />

    <template v-if="!isLoading">
      <QList>
        <QItem
          v-if="conversations.length === 0"
        >
          {{ $t('CONVERSATION.NO_CONVERSATIONS') }}
        </QItem>
        <LatestMessageItem
          v-for="conv in conversations"
          :key="conv.id"
          v-close-popup
          :group="conv.type === 'group' ? getGroupById(conv.targetId) : null"
          :user="conv.type === 'private' ? getUserById(conv.participants.find(u => !getIsCurrentUser(u))) : null"
          :activity="conv.type === 'activity' ? conv.target : null"
          :place="conv.type === 'place' ? getPlaceById(conv.targetId) : null"
          :application="conv.type === 'application' ? conv.target : null"
          :issue="conv.type === 'issue' ? conv.target : null"
          :offer="conv.type === 'offer' ? conv.target : null"
          :message="conv.latestMessage"
          :unread-count="conv.unreadMessageCount"
          :muted="conv.muted"
          :closed="conv.isClosed"
          :selected="isSelected(conv)"
          @open="open(conv)"
        />
        <QItem
          v-if="!asPopover && hasNextPage"
          class="row justify-center"
        >
          <QBtn
            size="sm"
            :loading="isFetchingNextPage"
            @click="() => fetchNextPage()"
          >
            {{ $t('BUTTON.SHOW_MORE') }}
          </QBtn>
        </QItem>
        <div
          v-if="asPopover"
          class="row justify-end q-my-sm q-mr-sm"
        >
          <QBtn
            v-close-popup
            size="sm"
            color="secondary"
            :to="{ name: 'latestConversations' }"
          >
            {{ $t('BUTTON.SHOW_MORE') }}
          </QBtn>
        </div>
      </QList>
    </template>
  </div>
</template>

<script>
import {
  QList,
  QItem,
  QBtn,
} from 'quasar'
import LatestMessageItem from './LatestMessageItem'
import KSpinner from '@/utils/components/KSpinner'
import { useConversationListQuery } from '../queries'
import { useDetailService } from '../services'
import { useGroupInfoService } from '@/groupInfo/services'
import { useUserService } from '@/users/services'
import { usePlaceService } from '@/places/services'
import { useAuthHelpers } from '@/authuser/helpers'
import { useConversationsMarkSeenMutation } from '../mutations'
import { useStatusService } from '@/status/services'

export default {
  components: {
    QList,
    QItem,
    QBtn,
    LatestMessageItem,
    KSpinner,
  },
  props: {
    asPopover: {
      type: Boolean,
      default: false,
    },
  },
  setup () {
    const {
      conversations,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
    } = useConversationListQuery()

    const {
      openActivity,
      openUserChat,
      openApplication,
      conversation: selectedConversation,
    } = useDetailService()

    const { unseenConversationCount } = useStatusService()

    const { mutate: doMarkConversationsSeen } = useConversationsMarkSeenMutation()

    function markConversationsSeen () {
      if (unseenConversationCount.value <= 0) return
      doMarkConversationsSeen()
    }

    const { getGroupById } = useGroupInfoService()
    const { getUserById } = useUserService()
    const { getPlaceById } = usePlaceService()
    const { getIsCurrentUser } = useAuthHelpers()

    return {
      conversations,
      isLoading,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      openActivity,
      openUserChat,
      openApplication,
      getGroupById,
      getUserById,
      getPlaceById,
      getIsCurrentUser,
      selectedConversation,
      markConversationsSeen,
    }
  },
  mounted () {
    setTimeout(() => this.markConversationsSeen(), 3 * 1000)
  },
  unmounted () {
    this.markConversationsSeen()
  },
  methods: {
    open (conv) {
      const { type, target, targetId } = conv
      switch (type) {
        case 'group': return this.$router.push({ name: 'group', params: { groupId: targetId }, hash: '#messages' }).catch(() => {})
        case 'place': return this.$router.push({ name: 'placeWall', params: { groupId: this.getPlaceById(targetId).group, placeId: targetId } }).catch(() => {})
        case 'activity': return this.openActivity(target)
        case 'private': {
          const otherUser = this.getUserById(conv.participants.find(u => !this.getIsCurrentUser(u)))
          return this.openUserChat(otherUser)
        }
        case 'application': return this.openApplication(target)
        case 'issue': return this.$router.push({ name: 'issueChat', params: { groupId: target.group, issueId: targetId } }).catch(() => {})
        case 'offer': return this.$router.push({
          name: 'offerDetail',
          params: { groupId: target.group, offerId: targetId },
          query: this.$route.query,
        }).catch(() => {})
      }
    },
    isSelected (conv) {
      if (!this.selectedConversation) return false
      if (Boolean(conv.thread) !== Boolean(this.selectedConversation.thread)) return false
      return conv.id === this.selectedConversation.id
    },
  },
}
</script>
