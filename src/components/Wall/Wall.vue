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
    <div>
      <h5 class="generic-padding wall-header">Wall</h5>
    </div>
    <WallInput @send="$emit('send', arguments[0])" />
    <q-infinite-scroll
      :handler="loadMore"
      ref="infiniteScroll">
      <WallMessage v-for="message in messages" :key="message.id" :message="message"/>
      <div slot="message" style="width: 100%; text-align: center">
        <q-spinner-dots :size="40"></q-spinner-dots>
      </div>
    </q-infinite-scroll>
    <div style="text-align: center">
      <div v-if="!canLoadMore">{{ $t('HISTORY.ALL_LOADED') }}</div>
      <pre>{{ messageReceiveStatus.error }}</pre>
      <pre>{{ messageReceiveMoreStatus.error }}</pre>
    </div>
  </div>
</template>

<script>
import WallMessage from './WallMessage.vue'
import EmptyPickups from './EmptyPickups.vue'
import JoinedPickups from './JoinedPickups.vue'
import WallInput from './WallInput.vue'
import { QBtn, QInfiniteScroll, QSpinnerDots } from 'quasar'

export default {
  components: {
    WallMessage,
    JoinedPickups,
    EmptyPickups,
    WallInput,
    QBtn,
    QInfiniteScroll,
    QSpinnerDots,
  },
  props: {
    messages: { required: true },
    joinedPickups: { required: false, default: () => [] },
    emptyPickups: { required: false, default: () => [] },
    messageReceiveStatus: { default: () => ({}) },
    messageReceiveMoreStatus: { default: () => ({}) },
    canLoadMore: { default: false },
    fetchMoreMessages: { required: true },
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
