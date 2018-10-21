<template>
  <q-btn
    :to="$q.platform.is.mobile && ({ name: 'messages' })"
    flat
    dense
    round
    @click="maybeOpen"
    :title="$t('GROUP.MESSAGES')"
  >
    <q-icon
      name="fas fa-comments"
    />
    <q-chip
      v-if="unreadCount > 0"
      floating
      :color="allUnreadMuted ? 'grey' : 'secondary'"
    >
      {{ unreadCount > 9 ? '9+' : unreadCount }}
    </q-chip>
    <q-popover
      v-if="!$q.platform.is.mobile"
      v-model="showing"
      class="k-latest-messages-popover"
    >
      <LatestMessages
        v-if="showing"
        as-popover
      />
    </q-popover>
  </q-btn>
</template>

<script>
import {
  QToolbar,
  QToolbarTitle, // TODO cleanup
  QBtn,
  QIcon,
  QChip,
  QPopover,
  QList,
  QItem,
  QTooltip,
} from 'quasar'
const LatestMessages = () => import('@/components/Conversation/LatestMessages')

import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters({
      unreadCount: 'latestMessages/unreadCount',
      allUnreadMuted: 'latestMessages/allUnreadMuted',
    }),
  },
  methods: {
    maybeOpen () {
      if (!this.$q.platform.is.mobile) {
        this.showing = true
      }
      this.$emit('click')
    },
  },
  data () {
    return {
      showing: false,
    }
  },
}
</script>

<style lang="stylus" scoped>
.k-latest-messages-popover
  width 400px
</style>
