<template>
  <QBtn
    :to="$q.platform.is.mobile && ({ name: 'notifications' })"
    flat
    dense
    round
    :title="$t('NOTIFICATION_BELLS_LIST.TITLE')"
    @click="maybeOpen"
  >
    <QIcon
      name="fas fa-bell"
      :class="{ hasUnseen: unseenCount > 0 }"
    />
    <QChip
      v-if="unseenCount > 0"
      floating
      color="secondary"
    >
      {{ unseenCount > 9 ? '9+' : unseenCount }}
    </QChip>
    <QPopover
      v-if="!$q.platform.is.mobile"
      v-model="showing"
      class="k-notifications-popover"
    >
      <Notifications
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
const Notifications = () => import('@/notifications/components/Notifications')

import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    QBtn,
    QIcon,
    QChip,
    QPopover,
    Notifications,
  },
  data () {
    return {
      showing: false,
    }
  },
  computed: {
    ...mapGetters({
      unseenCount: 'notifications/unseenCount',
    }),
  },
  methods: {
    ...mapActions({
      markSeen: 'notifications/markSeen',
    }),
    maybeOpen () {
      if (!this.$q.platform.is.mobile) {
        this.showing = true
        this.markSeen()
      }
      this.$emit('click')
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~variables'
.k-notifications-popover
  width 400px
.q-icon:not(.hasUnseen)
  opacity $topbar-opacity-low
.q-btn:hover .q-icon
  opacity 1
</style>
