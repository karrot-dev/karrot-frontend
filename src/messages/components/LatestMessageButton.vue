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
    <QBadge
      v-if="unseenCount > 0"
      floating
      :color="allUnreadMuted ? 'grey' : 'secondary'"
    >
      {{ unseenCount > 9 ? '9+' : unseenCount }}
    </QBadge>
    <QMenu
      v-if="!$q.platform.is.mobile"
      v-model="showing"
      class="k-latest-messages-popover"
    >
      <LatestMessages
        v-if="showing"
      />
    </QMenu>
  </QBtn>
</template>

<script>
import {
  QBtn,
  QIcon,
  QBadge,
  QMenu,
} from 'quasar'
const LatestMessages = () => import('@/messages/components/LatestMessages')

import { mapGetters } from 'vuex'

export default {
  components: {
    QBtn,
    QIcon,
    QBadge,
    QMenu,
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
