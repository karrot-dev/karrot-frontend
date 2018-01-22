<template>
  <div class="chat-messages-wrapper generic-padding">
    <q-chat-message
      name="Jane"
      avatar="statics/linux-avatar.png"
      :text="['hey, if you type in your pw asd asd as', 'it will show as stars']"
      stamp="1 day ago"
    />
    <q-chat-message
      name="me"
      avatar="statics/linux-avatar.png"
      :text="['test', 'it will show as star as dasds']"
      stamp="20 hours ago"
      sent
    />
    <q-chat-message
      name="Jane"
      avatar="statics/linux-avatar.png"
      :text="['hey, if you type', 'it will show as stars']"
      stamp="10 hours ago"
    />
    <q-chat-message
      name="me"
      avatar="statics/linux-avatar.png"
      :text="['test', 'Hey! This was my last message! It was very nice to hear from you recently']"
      stamp="7 hours ago"
      sent
    />
    <q-chat-message
      name="Jane"
      avatar="statics/linux-avatar.png"
      :text="['hey, if you type in your pw asd asd as', 'it will show as stars']"
      stamp="1 hour ago"
    />
    <q-chat-message
      name=""
      avatar="statics/linux-avatar.png"
      :text="['test', 'it will show as star as dasds']"
      stamp="20 minutes ago"
      sent
    />
    <q-chat-message
      name="Jane"
      avatar="statics/linux-avatar.png"
      :text="['hey, if you type', 'it will show as stars']"
      stamp="10 minutes ago"
    />
    <q-chat-message
      name=""
      avatar="statics/linux-avatar.png"
      :text="['test', 'Hey! This was my last message! It was very nice to hear from you recently']"
      stamp="7 minutes ago"
      sent
    />
    <div style="height: 20px"/>
  </div>
</template>

<script>
import { QChatMessage } from 'quasar'

export default {
  components: { QChatMessage },
}
</script>

<style scoped lang="stylus">
</style>

<style lang="stylus">
.chat-messages-wrapper .q-message-avatar
  display none
</style>
