<template>
  <div>
    <q-card
      class="grey-border chat-floater"
    >
      <div class="column no-wrap justify-between">
        <q-toolbar
          class="toolbar"
          color="secondary"
          @click.self="toggleOpen()"
        >
          <ProfilePicture
            user="{ displayName: 'Max Mustermann', id: 2 }"
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
            <div class="content generic-padding">
              <q-chat-message
                name="Jane"
                avatar="statics/linux-avatar.png"
                :text="['hey, if you type in your pw asd asd as', 'it will show as stars']"
                stamp="7 minutes ago"
              />
              <q-chat-message
                name="me"
                avatar="statics/linux-avatar.png"
                :text="['test', 'it will show as star as dasds']"
                stamp="7 minutes ago"
                sent
              />
              <q-chat-message
                name="Jane"
                avatar="statics/linux-avatar.png"
                :text="['hey, if you type', 'it will show as stars']"
                stamp="7 minutes ago"
              />
              <q-chat-message
                name="me"
                avatar="statics/linux-avatar.png"
                :text="['test', 'it will show as star as dasds']"
                stamp="7 minutes ago"
                sent
              />
              <div style="height: 20px"/>
            </div>
          </div>
        </transition>
        <div
          v-if="isOpen"
          class="new-message bg-neutral">
          <ConversationCompose :placeholder="$t('WALL.WRITE_MESSAGE')"/>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QChatMessage, QToolbar, QToolbarTitle, QBtn } from 'quasar'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import ConversationCompose from '@/components/Conversation/ConversationCompose'

export default {
  name: 'ChatFloater',
  components: { ProfilePicture, ConversationCompose, QCard, QChatMessage, QToolbar, QToolbarTitle, QBtn },
  data () {
    return {
      isOpen: true,
    }
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
  width 300px
  margin-bottom 0
  position relative
  .column
    max-height 450px
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
.chat-floater .content .q-message-avatar
  display none
</style>
