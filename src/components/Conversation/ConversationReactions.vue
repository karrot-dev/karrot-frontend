<template>
  <!-- emoji reactions to messages -->
  <div class="message-reactions">
    <!-- reactions -->
    <q-btn
      @click.native="toggleReaction(reaction.name)"
      v-for="reaction in collectedReactions"
      :key="reaction.name"
      flat
      small
    >
      <Markdown
        :source="':' + reaction.name + ':' + reaction.users.length"
      />
    </q-btn>
    <!-- add a reaction -->
    <q-btn>
      <i class="fa fa-smile-o" /> +
      <q-popover
        ref="popover"
      >
        <q-btn
          @click.native="toggleReaction(reaction)"
          v-for="reaction in reactionsWhitelist"
          :key="reaction"
          flat
          small
        >
          <Markdown
            :source="':' + reaction + ':'"
          />
        </q-btn>
      </q-popover>
    </q-btn>
  </div>
</template>

<script>
import Markdown from '@/components/Markdown'
import { QBtn, QPopover } from 'quasar'

export default {
  name: 'ConversationReactions',
  components: {
    Markdown, QBtn, QPopover,
  },
  data: () => ({
    reactionsWhitelist: [
      'thumbsup',
      'thumbsdown',
      'laughing',
      'tada',
      'confused',
      'heart',
    ],
  }),
  computed: {
    collectedReactions () {
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
      const isAlreadyReacted = Boolean(this.reactions.find(reaction => reaction.name === name && reaction.user === this.user.id))
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
</style>
