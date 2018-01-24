<template>
  <div>
    <q-card
      class="chat-floater"
    >
      <div class="column no-wrap justify-between">
        <q-toolbar
          class="toolbar"
          color="chat"
          @click.self="toggleOpen()"
        >
          <ProfilePicture
            :user="{ displayName: 'Max Mustermann', id: 2 }"
            :size="24"
          />
          <q-toolbar-title>
            Max Mustermann
          </q-toolbar-title>
          <slot name="tools" />
          <q-btn
            flat
            class="card-arrow"
            @click="toggleOpen()"
          >
            <i
              class="fa fa-angle-up arrow"
              :class="{ upsideDown: isOpen }"
            />
          </q-btn>
        </q-toolbar>
        <transition name="slide-toggle">
          <div
            v-if="isOpen"
            class="content-wrapper">
            <ChatMessages
              :data="data"
              :fetch-more="fetchMore"
              :user="user"/>
          </div>
        </transition>
        <div
          v-if="isOpen"
          class="new-message bg-neutral">
          <ConversationCompose
            @send="$emit('send', arguments[0])"
            :status="data.sendStatus"
            :placeholder="$t('WALL.WRITE_MESSAGE')"/>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QToolbar, QToolbarTitle, QBtn } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import ConversationCompose from '@/components/Conversation/ConversationCompose'
import ChatMessages from '@/components/Conversation/ChatMessages'

export default {
  name: 'ChatFloater',
  components: { ProfilePicture, ConversationCompose, QCard, ChatMessages, QToolbar, QToolbarTitle, QBtn },
  data () {
    return {
      isOpen: false,
    }
  },
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
    toggleOpen (event) {
      this.isOpen = !this.isOpen
    },
  },
}
</script>

<style scoped lang="stylus">
.chat-floater
  width 270px
  font-size .9em
  margin-bottom 0
  position relative
  .column
    max-height 420px
  .toolbar
    min-height 40px
    height 40px
  .card-arrow
    margin-left 1em
    cursor pointer
    min-width 30px
    .arrow
      transition: all .3s ease;
  .upsideDown
    transform rotate(-180deg)

  .slide-toggle-enter-active,
  .slide-toggle-leave-active
    transition max-height .2s
    overflow hidden
  .slide-toggle-enter-active
      max-height 1000px
  .slide-toggle-enter,
  .slide-toggle-leave-active
      max-height 0
  .slide-toggle-leave
      max-height 1000px
  .column
    height 100%
  .content-wrapper
    height 100%
    overflow-y auto
    .content
      word-wrap break-word
      height: 100%
      min-height 300px
</style>

<style lang="stylus">
.chat-floater .new-message .q-field
  margin 6px 0
</style>
