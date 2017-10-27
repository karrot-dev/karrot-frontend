<template>
  <div class="wrapper">
    <div class="notices">
      <div v-if="joinedPickups.length > 0">
        <JoinedPickups
          :pickups="joinedPickups"
          @join="$emit('join', arguments[0])"
          @leave="$emit('leave', arguments[0])"
        />
      </div>
      <div v-if="emptyPickups.length > 0">
        <EmptyPickups
          :pickups="emptyPickups"
          @join="$emit('join', arguments[0])"
          @leave="$emit('leave', arguments[0])"
        />
      </div>
    </div>
    <q-alert v-if="messageReceiveStatus.error">
      {{ messageReceiveStatus.error }}
    </q-alert>
    <template v-if="messageReceiveStatus.success">
      <WallInput :status="sendStatus" @send="$emit('send', arguments[0])" :placeholder="messagePrompt" />
      <q-infinite-scroll
        :handler="loadMore"
        ref="infiniteScroll">
        <q-list highlight inset-separator class="bg-white" v-if="messages.length > 0">
          <WallMessage v-for="message in messages" :key="message.id" :message="message"/>
        </q-list>
        <div slot="message" style="width: 100%; text-align: center">
          <q-spinner-dots :size="40"></q-spinner-dots>
        </div>
      </q-infinite-scroll>
      <q-alert v-if="messageReceiveMoreStatus.error">
        {{ messageReceiveMoreStatus.error }}
      </q-alert>
    </template>

  </div>
</template>

<script>
import WallMessage from './WallMessage.vue'
import EmptyPickups from './EmptyPickups.vue'
import JoinedPickups from './JoinedPickups.vue'
import WallInput from './WallInput.vue'
import { QBtn, QInfiniteScroll, QSpinnerDots, QList, QAlert } from 'quasar'

export default {
  components: {
    WallMessage,
    JoinedPickups,
    EmptyPickups,
    WallInput,
    QBtn,
    QInfiniteScroll,
    QSpinnerDots,
    QList,
    QAlert,
  },
  props: {
    messages: { required: true },
    joinedPickups: { required: false, default: () => [] },
    emptyPickups: { required: false, default: () => [] },
    messageReceiveStatus: { default: () => ({}) },
    messageReceiveMoreStatus: { default: () => ({}) },
    canLoadMore: { default: false },
    fetchMoreMessages: { required: true },
    sendStatus: { required: true },
  },
  methods: {
    loadMore (index, done) {
      if (!this.canLoadMore) {
        done()
        return
      }
      this.fetchMoreMessages().then((data) => {
        done()
      })
    },
  },
  computed: {
    messagePrompt () {
      if (this.messages.length > 0) {
        return this.$t('write a message')
      }
      else {
        return this.$t('write the first message')
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.notices
  margin-top .5em
  margin-bottom 3em
.wall-header
  margin-bottom 0
</style>
