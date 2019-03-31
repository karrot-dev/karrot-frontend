<template>
  <QBtn
    :to="$q.platform.is.mobile && ({ name: 'messages' })"
    flat
    dense
    round
    :title="$t('GROUP.MESSAGES')"
    @click="maybeOpen"
  >
    <QIcon
      name="fas fa-comments"
      :class="{ hasUnread: unreadCount > 0 }"
    />
    <QChip
      v-if="unseenCount > 0"
      floating
      :color="allUnreadMuted ? 'grey' : 'secondary'"
    >
      {{ unseenCount > 9 ? '9+' : unseenCount }}
    </QChip>
    <QPopover
      v-if="!$q.platform.is.mobile"
      v-model="showing"
      class="k-latest-messages-popover"
    >
      <LatestMessages
        v-if="showing"
        as-popover
      />
    </QPopover>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QIcon,
  QChip,
  QPopover,
} from 'quasar'
const LatestMessages = () => import('@/messages/components/LatestMessages')

import { mapGetters } from 'vuex'

export default {
  components: {
    QBtn,
    QIcon,
    QChip,
    QPopover,
    LatestMessages,
  },
  data () {
    return {
      showing: false,
    }
  },
  computed: {
    ...mapGetters({
      unseenCount: 'latestMessages/unseenCount',
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
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.k-latest-messages-popover
  width 400px
.q-icon:not(.hasUnread)
  opacity $topbar-opacity-low
.q-btn:hover .q-icon
  opacity 1
</style>
