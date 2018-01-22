<template>
  <div>
    <div v-if="!$q.platform.is.mobile">
      <q-card class="chat-wrapper-desktop no-shadow grey-border">
        <div class="messages">
          <div class="column no-wrap">
            <q-toolbar color="secondary">
              <ProfilePicture
                :user="{ displayName: 'Max Mustermann', id: 2 }"
                :size="24"
              />
              <q-toolbar-title>
                Max Mustermann
              </q-toolbar-title>
            </q-toolbar>
            <div
              v-chat-scroll="{always: false}"
              class="content">
              <router-view name="detail" />
            </div>
            <div class="new-message bg-neutral shadow-1">
              <ConversationCompose :placeholder="$t('WALL.WRITE_MESSAGE')"/>
            </div>
          </div>
        </div>
      </q-card>
    </div>
    <div v-if="$q.platform.is.mobile">
      <q-card class="no-mobile-margin chat-wrapper no-shadow grey-border">
        <ChatList/>
        <q-btn
          color="primary"
          @click="open = true">
          Open Chat (since list is not working yet)
        </q-btn>
      </q-card>
    </div>
    <q-modal
      v-if="$q.platform.is.mobile"
      v-model="open"
      maximized>
      <q-modal-layout
        ref="chatlayoutMobile"
      >
        <div slot="header">
          <q-toolbar color="secondary">
            <q-toolbar-title>
              Max Mustermann
            </q-toolbar-title>
            <q-btn
              @click="open = false"
              flat>
              <i class="fa fw fa-times"/>
            </q-btn>
          </q-toolbar>
        </div>
        <div>
          <router-view name="detail" />
        </div>
        <div
          slot="footer"
          class="new-message bg-neutral">
          <ConversationCompose
            :status="false"
            :placeholder="$t('WALL.WRITE_MESSAGE')"/>
        </div>
      </q-modal-layout>
    </q-modal>
  </div>
</template>

<script>
import ChatList from '@/components/Conversation/ChatList'
import ConversationCompose from '@/components/Conversation/ConversationCompose'
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import { QModal, QCard, QToolbar, QToolbarTitle, QModalLayout, QBtn } from 'quasar'

export default {
  components: { ProfilePicture, ConversationCompose, QModal, QCard, QToolbar, QToolbarTitle, QModalLayout, QBtn, ChatList },
  data () {
    return {
      open: this.$route.name === 'chatDetail',
    }
  },
}
</script>

<style scoped lang="stylus">
.chat-wrapper-desktop
  height: 80vh
  .chatlist
    max-width 320px
  .messages
    width 100%
    overflow hidden
    .column
      height 80vh
    .content
      overflow-y auto
</style>
