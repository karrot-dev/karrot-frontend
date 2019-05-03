<template>
  <span class="conversation-reactions">
    <span class="reactions">
      <EmojiButton
        v-for="reaction in reactions"
        :key="reaction.name"
        v-touch-hold="toggleDetail"
        :name="reaction.name"
        class="reaction-box"
        :class="{ 'user-reacted': reaction.reacted }"
        :title="reaction.message"
        @click="$emit('toggle', reaction.name)"
      >
        <span class="reactions-number">{{ reaction.users.length }}</span>
      </EmojiButton>
    </span>
    <ConversationAddReaction
      class="add-button reaction-box"
      :reacted="currentUserReactions"
      :opacity="0.5"
      @toggle="$emit('toggle', arguments[0])"
    />
    <QModal
      v-if="$q.platform.has.touch"
      v-model="showDetail"
      content-classes="bg-grey-10 text-grey-1 q-pa-md"
    >
      <template v-if="showDetail">
        <QItem
          v-for="reaction in reactions"
          :key="reaction.name"
          multiline
          @click.native="toggleDetail"
        >
          <QItemSide>
            <EmojiButton
              :name="reaction.name"
              class="big"
            />
          </QItemSide>
          <QItemMain
            :label="reaction.users.map(u => u.displayName).join(', ')"
            :sublabel="`:${reaction.name}:`"
          />
        </QItem>
        <QBtn
          v-t="'BUTTON.CLOSE'"
          outline
          @click="toggleDetail"
        />
      </template>
    </QModal>
  </span>
</template>

<script>
import ConversationAddReaction from './ConversationAddReaction'
import EmojiButton from './EmojiButton'

import {
  QModal,
  QItem,
  QItemMain,
  QItemSide,
  QBtn,
} from 'quasar'

export default {
  name: 'ConversationReactions',
  components: {
    ConversationAddReaction,
    EmojiButton,
    QModal,
    QItem,
    QItemMain,
    QItemSide,
    QBtn,
  },
  props: {
    reactions: {
      type: Array,
      default: () => [],
    },
    currentUserReactions: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      showDetail: false,
    }
  },
  methods: {
    toggleDetail () {
      this.showDetail = !this.showDetail
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import './reactionBox'
.add-button
  margin-left -4px
  transition none
.desktop .conversation-reactions
  .add-button
    visibility hidden
  &:hover .add-button
    visibility visible
.user-reacted
  background alpha($secondary, .2)
  border-color $secondary !important
.reactions-number
  padding-left 3px
  opacity .7
  font-size .8em
.big
  font-size 1.6em
</style>
