<template>
  <q-item
    v-if="!editMode"
    multiline
    :class="{ isUnread: message.isUnread, slim }"
    class="conversation-message relative-position"
    highlight
  >
    <q-btn-group
      flat
      class="hover-button k-message-controls"
    >
      <q-btn
        v-if="message.isEditable"
        flat
        @click="toggleEdit"
      >
        <i class="fas fa-pencil-alt" />
        <q-tooltip v-t="'BUTTON.EDIT'" />
      </q-btn>
      <q-btn
        v-if="!slim"
        flat
        @click="$emit('openThread')"
      >
        <i class="fas fa-comments" />
        <q-tooltip v-t="'CONVERSATION.REPLIES'" />
      </q-btn>
      <ConversationAddReaction
        :reacted="currentUserReactions"
        @toggle="toggleReaction"
      />
    </q-btn-group>
    <q-item-side v-if="!slim">
      <ProfilePicture
        :user="message.author"
        :size="$q.platform.is.mobile ? 30 : 40"
        style="margin-top: 6px"
      />
    </q-item-side>
    <q-item-main>
      <q-item-tile
        class="no-wrap k-message-meta"
      >
        <router-link :to="{ name: 'user', params: { userId: message.author.id } }">
          <span class="k-message-author text-bold text-secondary uppercase">{{ message.author.displayName }}</span>
        </router-link>
        <span class="message-date">
          <small class="text-weight-light">
            <DateAsWords :date="message.createdAt" />
          </small>
        </span>
        <q-icon
          v-if="message.receivedVia === 'email'"
          name="far fa-envelope"
          class="email-icon"
        >
          <q-tooltip v-t="'WALL.RECEIVED_VIA_EMAIL'" />
        </q-icon>
      </q-item-tile>
      <div class="content">
        <Markdown :source="message.content" />
      </div>
      <div
        v-if="message.isEdited"
        style="margin-top: -5px; opacity: .5"
      >
        <small class="text-italic">
          ({{ $t('CONVERSATION.EDITED') }}
          <DateAsWords
            :date="message.editedAt"
            style="display: inline"
          />)
        </small>
      </div>
      <ConversationReactions
        v-if="hasReactions"
        :reactions="message.reactions"
        :current-user-reactions="currentUserReactions"
        @toggle="toggleReaction"
        style="margin-top: 8px; display: block"
      />
      <q-btn
        v-if="showReplies"
        :outline="message.threadMeta.unreadReplyCount < 1"
        :color="message.threadMeta.unreadReplyCount > 0 ? 'secondary' : null"
        @click="$emit('openThread')"
        class="reaction-box k-thread-box"
        no-caps
      >
        <ProfilePicture
          class="k-profile-picture"
          v-for="user in message.threadMeta.participants"
          :key="user.id"
          :user="user"
          :is-link="false"
        />
        <span
          class="k-replies-count"
          v-t="{
            path: 'CONVERSATION.REPLIES_COUNT',
            choice: message.threadMeta.replyCount,
            args: {
              count: message.threadMeta.replyCount > 99 ? '99+' : message.threadMeta.replyCount,
            },
          }"
        />
      </q-btn>
    </q-item-main>
  </q-item>
  <ConversationCompose
    v-else
    :status="message.saveStatus"
    @submit="save"
    @leaveEdit="toggleEdit"
    :user="message.author"
    :value="message.content"
    :slim="slim"
  />
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import ConversationReactions from '@/components/Conversation/ConversationReactions'
import ConversationCompose from '@/components/Conversation/ConversationCompose'
import {
  QBtn,
  QBtnGroup,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
  QIcon,
  QTooltip,
} from 'quasar'
import DateAsWords from '@/components/General/DateAsWords'
import Markdown from '@/components/Markdown'
import ConversationAddReaction from './ConversationAddReaction'
export default {
  name: 'ConversationMessage',
  components: {
    ConversationReactions,
    ConversationAddReaction,
    ConversationCompose,
    ProfilePicture,
    QBtn,
    QBtnGroup,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    DateAsWords,
    QIcon,
    QTooltip,
    Markdown,
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
  methods: {
    toggleReaction (name) {
      this.$emit('toggleReaction', {
        message: this.message,
        name,
      })
    },
    toggleEdit () {
      this.editMode = !this.editMode
    },
    save (content) {
      this.$emit('save', {
        message: {
          id: this.message.id,
          content,
        },
        done: this.toggleEdit,
      })
    },
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
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import './reactionBox'

.isUnread
  background linear-gradient(to right, $lightGreen, $lighterGreen)

body.mobile .conversation-message
  &:not(.slim)
    padding-left 0
  >>> .q-item-side
    min-width 0
  .k-message-meta
    font-size 80%
    padding-top 3px
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
    .k-profile-picture
      margin-right 2px
      vertical-align middle
    .k-replies-count
      margin-left 4px
      font-size 13px
      font-weight 500
      padding-right 3px
  .k-message-controls
    position absolute
    background $secondary
    top -12px
    right 8px
    .q-btn
      color white
      transition none
      padding 2px 9px
      font-size 13px
body.desktop
  .conversation-message.slim .k-message-controls
    top -8px
    .q-btn
      min-height 24px
      font-size 12px
  .k-message-meta
    padding-top 4px

</style>
