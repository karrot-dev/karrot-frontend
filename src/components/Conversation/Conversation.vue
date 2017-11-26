<template>
  <div>
    <q-alert v-if="data.fetchStatus.hasValidationErrors">
      {{ data.fetchStatus.validationErrors }}
    </q-alert>
    <template v-if="hasLoaded">
      <q-infinite-scroll
        :handler="loadMore"
        ref="infiniteScroll">
        <q-list :highlight="false" class="bg-white desktop-margin">
          <ConversationCompose :status="data.sendStatus" @send="$emit('send', arguments[0])" :placeholder="messagePrompt" :user="user" />
          <ConversationMessage v-for="message in data.messages" :key="message.id" :message="message"/>
        </q-list>
        <div slot="message" style="width: 100%; text-align: center">
          <q-spinner-dots :size="40"></q-spinner-dots>
        </div>
      </q-infinite-scroll>
      <q-alert v-if="data.fetchMoreStatus.hasValidationErrors">
        {{ data.fetchMoreStatus.validationErrors }}
      </q-alert>
    </template>
  </div>
</template>

<script>
import ConversationMessage from './ConversationMessage'
import ConversationCompose from './ConversationCompose'
import { QBtn, QInfiniteScroll, QSpinnerDots, QList, QAlert } from 'quasar'

export default {
  name: 'Conversation',
  components: {
    ConversationMessage,
    ConversationCompose,
    QBtn,
    QInfiniteScroll,
    QSpinnerDots,
    QList,
    QAlert,
  },
  props: {
    data: { required: true },
    fetchMore: { required: true },
    user: { required: true },
  },
  methods: {
    loadMore (index, done) {
      if (!this.data.canLoadMore) {
        done()
        return
      }
      this.fetchMore().then((data) => {
        done()
      })
    },
  },
  computed: {
    hasLoaded () {
      const s = this.data.fetchStatus
      return !s.pending && !s.hasValidationErrors
    },
    messagePrompt () {
      if (this.data.messages.length > 0) {
        return this.$t('WALL.WRITE_MESSAGE')
      }
      else {
        return this.$t('WALL.WRITE_FIRST_MESSAGE')
      }
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
