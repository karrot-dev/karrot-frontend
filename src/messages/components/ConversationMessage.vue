<template>
  <QItem
    v-if="!editMode"
    :class="{ 'is-unread': isUnread, continuation }"
    class="conversation-message relative-position"
  >
    <QBtnGroup
      unelevated
      class="hover-button k-message-controls bg-green-1 rounded-borders"
    >
      <QBtn
        v-if="message.isEditable"
        :title="$t('BUTTON.EDIT')"
        unelevated
        text-color="secondary"
        @click="toggleEdit"
      >
        <i class="fas fa-pencil-alt" />
      </QBtn>
      <QBtn
        v-if="!slim"
        :title="$t('CONVERSATION.REPLIES')"
        unelevated
        text-color="secondary"
        @click="() => openThread(message)"
      >
        <i class="fas fa-comments" />
      </QBtn>
      <ConversationAddReaction
        :reacted="currentUserReactions"
        text-color="secondary"
        unelevated
        @toggle="toggleReaction"
      />
    </QBtnGroup>
    <QItemSection
      side
      top
      class="q-mt-xs q-pr-sm"
    >
      <ProfilePicture
        :user="author"
        :size="$q.platform.is.mobile ? 30 : 36"
        :class="continuation && 'invisible'"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel
        v-if="!continuation"
        class="no-wrap k-message-meta"
      >
        <RouterLink :to="{ name: 'user', params: { userId: author.id } }">
          <span class="k-message-author text-bold text-secondary">{{ author.displayName }}</span>
        </RouterLink>
        <span class="message-date">
          <small class="text-weight-light">
            <DateAsWords
              :title="tooltipDate"
              :date="message.createdAt"
              :future="false"
            />
          </small>
        </span>
        <QIcon
          v-if="message.receivedVia === 'email'"
          name="far fa-envelope"
          class="email-icon"
          :title="$t('WALL.RECEIVED_VIA_EMAIL')"
        />
      </QItemLabel>
      <div class="content full-width">
        <Markdown
          v-measure
          :source="message.content"
          mentions
        />
      </div>
      <QItemLabel
        v-if="getIsMessageEdited(message)"
        caption
        class="q-pb-xs text-weight-light"
      >
        ({{ $t('CONVERSATION.EDITED') }}
        <DateAsWords
          :date="message.editedAt"
          style="display: inline; margin-right: -4px"
          :future="false"
        />
        )
      </QItemLabel>
      <Attachments :model-value="message.attachments" />
      <div
        v-if="imagesForDisplay.length > 0"
        class="images"
      >
        <QImg
          v-for="image in imagesForDisplay"
          :key="image.id"
          :src="image.imageUrls['200']"
          class="q-mr-sm q-mb-sm"
          @click="openImageGallery(image.id)"
        />
      </div>
      <ConversationReactions
        v-if="hasReactions"
        :reactions="message.reactions"
        :current-user-reactions="currentUserReactions"
        @toggle="toggleReaction"
      />
      <div v-if="showReplies">
        <QBtn
          unelevated
          class="reaction-box k-thread-box"
          :class="{ 'has-unread': message.threadMeta.unreadReplyCount > 0 }"
          no-caps
          @click="() => openThread(message)"
        >
          <ProfilePicture
            v-for="user in threadParticipants"
            :key="user.id"
            class="k-profile-picture"
            :user="user"
            :is-link="false"
          />
          <span
            v-t="{
              path: 'CONVERSATION.REPLIES_COUNT',
              choice: message.threadMeta.replyCount,
              args: {
                count: message.threadMeta.replyCount > 99 ? '99+' : message.threadMeta.replyCount,
              },
            }"
            class="k-replies-count text-caption"
          />
        </QBtn>
      </div>
      <div v-else-if="supportsThreads">
        <QBtn
          color="grey-2"
          text-color="grey-8"
          class="reaction-box k-thread-box"
          no-caps
          @click="() => openThread(message)"
        >
          <ProfilePicture
            class="k-profile-picture"
            :user="currentUser"
            :is-link="false"
          />
          <span class="k-replies-count text-caption">
            {{ t('CONVERSATION.REPLY_TO_MESSAGE') }}
          </span>
        </QBtn>
      </div>
    </QItemSection>
  </QItem>
  <ConversationCompose
    v-else
    :status="saveMessageStatus"
    :user="author"
    :value="message"
    :slim="slim"
    class="bg-white"
    @submit="save"
    @leave-edit="toggleEdit"
  />
</template>

<script setup>
import {
  Dialog,
  QBtn,
  QBtnGroup,
  QImg,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
} from 'quasar'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuthHelpers, useCurrentUser } from '@/authuser/helpers'
import { useMessageHelpers } from '@/messages/helpers'
import {
  useAddReactionMutation,
  useRemoveReactionMutation,
  useSaveMesssageMutation,
} from '@/messages/mutations'
import { useDetailService } from '@/messages/services'
import { useUserService } from '@/users/services'

import Attachments from '@/messages/components/Attachments.vue'
import ConversationCompose from '@/messages/components/ConversationCompose.vue'
import ConversationReactions from '@/messages/components/ConversationReactions.vue'
import ImageGalleryDialog from '@/messages/components/ImageGalleryDialog.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'
import Markdown from '@/utils/components/Markdown.vue'

import ConversationAddReaction from './ConversationAddReaction.vue'

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  isUnread: {
    type: Boolean,
    default: false,
  },
  continuation: {
    type: Boolean,
    default: false,
  },
  slim: {
    type: Boolean,
    default: false,
  },
  supportsThreads: {
    type: Boolean,
    default: false,
  },
})

const { getIsCurrentUser } = useAuthHelpers()
const { getUserById } = useUserService()
const { openThread } = useDetailService()
const { getIsMessageEdited } = useMessageHelpers()
const currentUser = useCurrentUser()

const author = computed(() => getUserById(props.message.author))
const threadParticipants = computed(() => props.message.threadMeta?.participants?.map(getUserById) ?? [])

const {
  mutateAsync: saveMessage,
  status: saveMessageStatus,
} = useSaveMesssageMutation()

const { mutate: addReaction } = useAddReactionMutation()
const { mutate: removeReaction } = useRemoveReactionMutation()

function toggleReaction (name) {
  const messageId = props.message.id
  const reactionIndex = props.message.reactions.findIndex(reaction => getIsCurrentUser(reaction.user) && reaction.name === name)

  if (reactionIndex === -1) {
    addReaction({ messageId, name })
  }
  else {
    removeReaction({ messageId, name })
  }
}

const editMode = ref(false)

const { t, d } = useI18n()

const currentUserReactions = computed(() => {
  return props.message?.reactions?.filter(reaction => getIsCurrentUser(reaction.user)).map(reaction => reaction.name)
})

const hasReactions = computed(() => props.message?.reactions?.length > 0)
const showReplies = computed(() => props.message.threadMeta && !props.slim)
const tooltipDate = computed(() => d(props.message.createdAt, 'long'))

const imagesForDisplay = computed(() => {
  return props.message?.images?.filter(image => image.id && !image._removed) || []
})

function toggleEdit () {
  editMode.value = !editMode.value
}

function openImageGallery (imageId) {
  Dialog.create({
    component: ImageGalleryDialog,
    componentProps: {
      message: props.message,
      selectedImageId: imageId,
    },
  })
}

async function save ({ content, images, attachments }) {
  await saveMessage({
    id: props.message.id,
    content,
    images,
    attachments,
  })
  toggleEdit()
}
</script>

<style scoped lang="sass">
@use 'sass:color'
@import './reactionBox'

.continuation
  min-height: auto
  padding-top: 0

.images
  .q-img
    width: 80px
    height: 80px
    cursor: pointer

body.mobile .conversation-message
  .k-message-meta
    padding-top: 3px
    font-size: 80%

.conversation-message
  padding-bottom: 0
  background-color: white

  .hover-button
    visibility: hidden

  &:hover .hover-button
    visibility: visible

  &.is-unread
    background: linear-gradient(to right, color.scale($secondary, $lightness: 82%), color.scale($secondary, $lightness: 93%))

  &.q-item-highlight:hover
    background-color: color.change($secondary, $alpha: .07)

  .email-icon
    position: relative
    top: -1.5px
    margin-left: 2px

  .content
    word-wrap: break-word

  .message-date
    display: inline-block
    margin-left: 2px

  .k-thread-box
    min-height: 36px
    max-height: 36px
    box-shadow: none
    background-color: $grey-3

    &.has-unread
      background-color: color.adjust($secondary, $lightness: 40%)

    ::v-deep(.q-btn__wrapper)
      min-height: 0
      padding: 0

    .k-profile-picture
      margin-right: 2px
      vertical-align: middle

    .k-replies-count
      padding-right: 3px
      margin-left: 4px
      font-size: 13px

  .k-message-controls
    position: absolute
    top: -6px
    right: 0px

    .q-btn
      padding-left: 12px
      padding-right: 12px
      font-size: 13px
      color: white
      transition: none

body.desktop
  .k-message-meta
    padding-top: 4px
</style>
