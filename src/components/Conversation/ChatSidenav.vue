<template>
  <span>
    <q-card class="no-shadow grey-border">
      <ChatList />
    </q-card>
    <div class="whitespace" />
  </span>
</template>

<script>
import { QCard } from 'quasar'
import ChatList from '@/components/Conversation/ChatList'

export default {
  components: { QCard, ChatList },
}
</script>

<style scoped lang="stylus">
</style>
