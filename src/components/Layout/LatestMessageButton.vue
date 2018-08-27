<template>
  <q-btn
    :to="$q.platform.is.mobile && ({ name: 'messages' })"
    flat
    dense
    round
    @click="maybeOpen"
  >
    <q-icon
      name="fas fa-comments"
    />
    <q-chip
      v-if="unreadCount > 0"
      floating
      :color="allUnreadMuted ? 'grey' : 'secondary'"
    >
      {{ unreadCount }}
    </q-chip>
    <q-popover v-model="showing">
      <LatestMessages
        v-if="showing"
        hide-load-more
      />
    </q-popover>
  </q-btn>
</template>

<script>
import {
  QToolbar,
  QToolbarTitle,
  QBtn,
  QIcon,
  QChip,
  QPopover,
  QList,
  QItem,
  QTooltip,
} from 'quasar'
const LatestMessages = () => import('@/components/Conversation/LatestMessages')

export default {
  components: {
    QToolbar,
    QToolbarTitle,
    QBtn,
    QIcon,
    QChip,
    QPopover,
    QList,
    QItem,
    QTooltip,
    LatestMessages,
  },
  props: {
    unreadCount: {
      default: 0,
      type: Number,
    },
    allUnreadMuted: {
      default: true,
      type: Boolean,
    },
  },
  methods: {
    maybeOpen () {
      if (!this.$q.platform.is.mobile) {
        this.showing = true
      }
    },
  },
  data () {
    return {
      showing: false,
    }
  },
}
</script>
