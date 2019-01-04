<template>
  <QBtn
    :to="$q.platform.is.mobile && ({ name: 'messages' })"
    flat
    dense
    round
    @click="maybeOpen"
    :title="$t('GROUP.MESSAGES')"
  >
    <QIcon
      name="fas fa-comments"
    />
    <QChip
      v-if="unreadCount > 0"
      floating
      :color="allUnreadMuted ? 'grey' : 'secondary'"
    >
      {{ unreadCount > 9 ? '9+' : unreadCount }}
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
