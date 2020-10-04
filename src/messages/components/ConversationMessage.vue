<template>
  <QItem
    v-if="!editMode"
    :class="{ isUnread: message.isUnread, slim, continuation: !!message.continuation }"
    class="conversation-message relative-position"
  >
    <QBtnGroup
      outline
      class="hover-button k-message-controls bg-white"
    >
      <QBtn
        v-if="message.isEditable"
        outline
        dense
        color="secondary"
        :title="$t('BUTTON.EDIT')"
        @click="toggleEdit"
      >
        <i class="fas fa-pencil-alt" />
      </QBtn>
      <QBtn
        v-if="!slim"
        outline
        dense
        color="secondary"
        :title="$t('CONVERSATION.REPLIES')"
        @click="$emit('open-thread')"
      >
        <i class="fas fa-comments" />
      </QBtn>
      <ConversationAddReaction
        :reacted="currentUserReactions"
        color="secondary"
        outline
        @toggle="toggleReaction"
      />
    </QBtnGroup>
    <QItemSection
      v-if="!slim"
      side
      top
      class="q-mt-xs q-pr-sm"
    >
      <ProfilePicture
        :user="message.author"
        :size="$q.platform.is.mobile ? 30 : 40"
      />
    </QItemSection>
    <QItemSection>
      <QItemLabel
        v-if="!message.continuation"
        class="no-wrap k-message-meta"
      >
        <RouterLink :to="{ name: 'user', params: { userId: message.author.id } }">
          <span class="k-message-author text-bold text-secondary text-uppercase">{{ message.author.displayName }}</span>
        </RouterLink>
        <span class="message-date">
          <small class="text-weight-light">
            <DateAsWords :date="message.createdAt" />
          </small>
        </span>
        <QIcon
          v-if="message.receivedVia === 'email'"
          name="far fa-envelope"
          class="email-icon"
          :title="$t('WALL.RECEIVED_VIA_EMAIL')"
        />
      </QItemLabel>
      <div
        class="content"
        :title="slim && tooltipDate"
      >
        <Markdown
          v-measure
          :source="message.content"
        />
      </div>
      <QItemLabel
        v-if="message.isEdited"
        caption
        class="q-pb-xs text-weight-light"
      >
        ({{ $t('CONVERSATION.EDITED') }}
        <DateAsWords
          :date="message.editedAt"
          style="display: inline; margin-right: -4px"
        />
        )
      </QItemLabel>
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
          :color="message.threadMeta.unreadReplyCount > 0 ? 'secondary' : 'white'"
          :text-color="message.threadMeta.unreadReplyCount > 0 ? 'white' : 'black'"
          class="reaction-box k-thread-box"
          no-caps
          @click="$emit('open-thread')"
        >
          <ProfilePicture
            v-for="user in message.threadMeta.participants"
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
    </QItemSection>
  </QItem>
  <ConversationCompose
    v-else
    :status="message.saveStatus"
    :user="message.author"
    :value="message"
    :slim="slim"
    @submit="save"
    @leave-edit="toggleEdit"
  />
</template>

<script>
import ConversationReactions from '@/messages/components/ConversationReactions'
import ConversationAddReaction from './ConversationAddReaction'
import ConversationCompose from '@/messages/components/ConversationCompose'
import ImageGalleryDialog from '@/messages/components/ImageGalleryDialog'
import ProfilePicture from '@/users/components/ProfilePicture'
import Markdown from '@/utils/components/Markdown'
import DateAsWords from '@/utils/components/DateAsWords'

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
export default {
  name: 'ConversationMessage',
  components: {
    ConversationReactions,
    ConversationAddReaction,
    ConversationCompose,
    ProfilePicture,
    Markdown,
    DateAsWords,
    QBtn,
    QBtnGroup,
    QImg,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    slim: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      editMode: false,
    }
  },
  computed: {
    currentUserReactions () {
      return this.message && this.message.reactions && this.message.reactions.filter(e => e.reacted).map(e => e.name)
    },
    hasReactions () {
      return this.message && this.message.reactions && this.message.reactions.length > 0
    },
    showReplies () {
      return this.message.threadMeta && !this.slim
    },
    tooltipDate () {
      return this.$d(this.message.createdAt, 'long')
    },
    imagesForDisplay () {
      if (!this.message || !this.message.images) return []
      return this.message.images.filter(image => image.id && !image._removed)
    },
  },
  methods: {
    toggleReaction (name) {
      this.$emit('toggle-reaction', {
        message: this.message,
        name,
      })
    },
    toggleEdit () {
      this.editMode = !this.editMode
    },
    openImageGallery (imageId) {
      Dialog.create({
        component: ImageGalleryDialog,
        parent: this,
        message: this.message,
        selectedImageId: imageId,
      })
    },
    save ({ content, images }) {
      this.$emit('save', {
        message: {
          id: this.message.id,
          content,
          images,
        },
        done: this.toggleEdit,
      })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import './reactionBox'

.isUnread
  background linear-gradient(to right, $lightGreen, $lighterGreen)

.continuation
  min-height auto
  padding-top 0

.images
  .q-img
    width 80px
    height 80px
    cursor pointer

body.mobile .conversation-message
  .k-message-meta
    padding-top 3px
    font-size 80%

.conversation-message
  padding-bottom 0

  .hover-button
    visibility hidden

  &:hover .hover-button
    visibility visible

  &.q-item-highlight:hover
    background-color alpha($secondary, .07)

  .email-icon
    position relative
    top -1.5px
    margin-left 2px

  .content
    word-wrap break-word

  .message-date
    display inline-block
    margin-left 2px

  .k-thread-box
    min-height 30px
    max-height 30px
    box-shadow none

    >>> .q-btn__wrapper
      min-height 0
      padding 0

    .k-profile-picture
      margin-right 2px
      vertical-align middle

    .k-replies-count
      padding-right 3px
      margin-left 4px
      font-size 13px

  .k-message-controls
    position absolute
    top -6px
    right 0px

    .q-btn
      padding 2px 9px
      font-size 13px
      color white
      transition none

body.desktop
  .conversation-message.slim .k-message-controls
    top -8px

    .q-btn
      min-height 24px
      font-size 12px

  .k-message-meta
    padding-top 4px
</style>
