<template>
  <div>
    <div
      v-if="data && fetchMore && user"
      class="scroll"
      v-chat-scroll="{always: false}"
      style="overflow-y: auto; height: 100%; width: 100%">
      <q-alert v-if="data.fetchStatus.hasValidationErrors">
        {{ data.fetchStatus.validationErrors }}
      </q-alert>
      <div
        v-if="hasLoaded"
        class="chat-messages-wrapper generic-padding">
        <q-scroll-observable @scroll="userHasScrolled" />
        <div
          class="no-more-messages"
          v-if="!data.canLoadMore">
          <div class="bg-chat">
            <i class="fa fa-times" />
            {{ $t('CHAT.NO_MORE_MESSAGES') }}
          </div>
        </div>
        <q-chat-message
          v-for="message in filteredMessages"
          :key="message.id"
          v-if="message.display"
          :message="message"
          avatar="statics/linux-avatar.png"
          :name="message.author.displayName"
          :text="message.content"
          :stamp="message.createdLabel"
          :bg-color="isSenderUser(message) ? '' : 'chat'"
          :sent="isSenderUser(message)"
        />
        <div style="height: 20px"/>
      </div>
    </div>
    <div v-else>
      <div
        style="height: 20em"
        class="generic-padding no-more-messages">
        <div class="bg-chat">
          {{ $t('CHAT.NO_MESSAGES_YET', {user: 'Max Mustermann'}) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QChatMessage, QAlert, QScrollObservable } from 'quasar'

import dateFnsHelper from '@/services/dateFnsHelper'

export default {
  name: 'Chat',
  components: { QChatMessage, QAlert, QScrollObservable },
  props: {
    data: {
      type: Object,
      required: true,
    },
    fetchMore: {
      type: Function,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    loadMore () {
      if (!this.data.canLoadMore) {
        return
      }
      this.fetchMore()
    },
    dateInWords (date) {
      return dateFnsHelper.distanceInWordsToNow(date, { addSuffix: true, disallowFuture: true })
    },
    isSenderUser (message) {
      return message.author.id === this.user.id
    },
    shouldMessagesBeAppended (message, otherMessage) {
      return message.author.id === otherMessage.author.id && this.dateInWords(message.createdAt) === this.dateInWords(otherMessage.createdAt)
    },
    displayMessage (message, index) {
      let prevMessage = this.data.messages.slice().reverse()[index - 1]
      if (!prevMessage) {
        return true
      }
      return !(this.shouldMessagesBeAppended(message, prevMessage))
    },
    getMessageContent (message, index) {
      let nextMessage = this.messages[index + 1]
      if (!nextMessage) {
        return [message.content]
      }
      if (this.shouldMessagesBeAppended(message, nextMessage)) {
        const i = index + 1
        let messageArray = [message.content]
        let nextElements = this.getMessageContent(nextMessage, i)
        messageArray = messageArray.concat(nextElements)
        return messageArray
      }
      return [message.content]
    },
    userHasScrolled (scroll) {
      if (scroll.position < 100 && scroll.direction === 'up') {
        this.loadMore()
      }
    },
  },
  computed: {
    hasLoaded () {
      const s = this.data.fetchStatus
      return !s.pending && !s.hasValidationErrors
    },
    messages () {
      return this.data.messages.slice().reverse()
    },
    filteredMessages () {
      let allMessages = this.messages.map((m, index) => {
        let displayed = this.displayMessage(m, index)
        return {
          'author': m.author,
          'display': displayed,
          'content': displayed ? this.getMessageContent(m, index) : '',
          'createdLabel': displayed ? this.dateInWords(m.createdAt) : '',
        }
      })
      return allMessages
    },
  },
}
</script>

<style scoped lang="stylus">
.no-more-messages
  width 100%
  text-align: center
  margin-bottom 2em
  > div
    color white
    padding 6px 10px
    border-radius 4px
    display inline-block
</style>

<style lang="stylus">
.chat-messages-wrapper .q-message-avatar
  display none
.chat-messages-wrapper .q-message-text-content
  word-break break-all
</style>
