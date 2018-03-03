<template>
  <!-- emoji reactions to messages -->
  <div class="message-reactions">
    <!-- reactions -->
    <q-btn
      class="reaction-button emoji-button"
      @click.native="toggleReaction(reaction.name)"
      v-for="reaction in collectedReactions"
      :key="reaction.name"
      flat
      small
      :class="{ 'user-reacted': reaction.reacted }"
    >
      <Emoji
        :emoji="reaction.name"
        :size="16"
        set="twitter"
      />
      <span class="reacted-users-count">{{ reaction.users.length }}</span>

      <!-- info whoever reacted -->
      <q-tooltip class="message-who-reacted">{{ reaction.message }}</q-tooltip>
    </q-btn>
    <!-- add a reaction -->
    <!-- to be replaced with nicer component -->
    <q-btn class="emoji-button">
      <i class="fa fa-smile-o" /> +
      <q-popover
        ref="popover"
      >
        <q-btn
          class="reaction-menu-button emoji-button"
          @click.native="toggleReaction(reaction)"
          v-for="reaction in reactionsWhitelist"
          :key="reaction"
          flat
          small
        >
          <Emoji
            :emoji="reaction"
            :size="20"
            set="twitter"
          />
        </q-btn>
      </q-popover>
    </q-btn>
  </div>
</template>

<script>
import Markdown from '@/components/Markdown'
import { QBtn, QPopover, QTooltip } from 'quasar'
import { Emoji } from 'emoji-mart-vue'

export default {
  name: 'ConversationReactions',
  components: {
    Emoji, Markdown, QBtn, QPopover, QTooltip,
  },
  data: () => {
    return {
      reactionsWhitelist: [
        '+1',
        '-1',
        'laughing',
        'tada',
        'confused',
        'heart',
      ],
    }
  },
  computed: {
    collectedReactions () {
      // collect the reactions
      const reactions = []

      for (const rawReaction of this.reactions) {
        const reaction = reactions.find(reac => reac.name === rawReaction.name)

        if (reaction !== undefined) {
          reaction.users.push(rawReaction.user)
        }
        else {
          reactions.push({ name: rawReaction.name, users: [rawReaction.user] })
        }
      }

      // mark reactions where user reacted
      reactions.forEach(reaction => {
        // has logged user reacted?
        reaction.reacted = Boolean(reaction.users.find(user => user.id === this.user.id))

        // which users reacted?
        const names = reaction.users.map(user => (user.id === this.user.id) ? 'you' : user.displayName)
        // form the message which users reacted
        // i.e. "foo, bar and baz reacted with heart"
        const namesString = names.slice(0, -2).join(', ') + (names.slice(0, -2).length ? ', ' : '') + names.slice(-2).join(' and ')
        reaction.message = `${namesString} reacted with ${reaction.name}`
      })

      return reactions
    },
  },
  methods: {
    /**
     * Emit an event to add or remove a reaction.
     * Remove when it is already there.
     */
    toggleReaction (name) {
      // What is the proper action? Are we adding or removing the reaction?
      const isAlreadyReacted = Boolean(this.reactions.find(reaction => reaction.name === name && reaction.user.id === this.user.id))
      const action = (isAlreadyReacted) ? 'remove' : 'add'
      // emit the action
      this.$emit('edit', { action, name, messageId: this.messageId, userId: this.user.id })
      // close the menu if open
      this.$refs.popover.close()
    },
  },
  props: {
    messageId: {
      type: Number,
      required: true,
    },
    reactions: {
      type: Array,
      default () { return [] },
    },
    user: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
.message-reactions
  float right
  color grey
.user-reacted
  background-color #ccf
.message-who-reacted
  font-size smaller
.emoji-button
  padding 0.2rem 0.5rem
</style>
