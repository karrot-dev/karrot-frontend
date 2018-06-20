<template>
  <span class="conversation-reactions">
    <span class="reactions">
      <EmojiButton
        v-for="reaction in reactions"
        :key="reaction.name"
        :name="reaction.name"
        @click="$emit('toggle', reaction.name)"
        class="reaction-box"
        :class="{ 'user-reacted': reaction.reacted }"
        :title="reaction.message"
      >
        <span class="reactions-number">{{ reaction.users.length }}</span>
      </EmojiButton>
    </span>
    <ConversationAddReaction
      class="add-button reaction-box"
      :reacted="currentUserReactions"
      @toggle="$emit('toggle', arguments[0])"
    />
  </span>
</template>

<script>
import ConversationAddReaction from './ConversationAddReaction'
import EmojiButton from './EmojiButton'
import { QBtn, QPopover, QTooltip } from 'quasar'

export default {
  name: 'ConversationReactions',
  components: { QBtn, QPopover, QTooltip, ConversationAddReaction, EmojiButton },
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
}
</script>

<style scoped lang="stylus">
@import '~variables'
@import './reactionBox'
.add-button
  margin-left -4px
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
</style>
