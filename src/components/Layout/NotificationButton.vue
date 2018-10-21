<template>
  <q-btn
    :to="$q.platform.is.mobile && ({ name: 'notifications' })"
    flat
    dense
    round
    @click="maybeOpen"
    :title="$t('NOTIFICATION_BELLS_LIST.TITLE')"
  >
    <q-icon
      name="fas fa-bell"
    />
    <q-chip
      v-if="unseenCount > 0"
      floating
      color="secondary"
    >
      {{ unseenCount > 9 ? '9+' : unseenCount }}
    </q-chip>
    <q-popover
      v-if="!$q.platform.is.mobile"
      v-model="showing"
      class="k-notifications-popover"
    >
      <Notifications
        v-if="showing"
        as-popover
      />
    </q-popover>
  </q-btn>
</template>

<script>
import {
  QBtn,
  QIcon,
  QChip,
  QPopover,
} from 'quasar'
const Notifications = () => import('@/components/Layout/Notifications')

import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    QBtn,
    QIcon,
    QChip,
    QPopover,
    Notifications,
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
  data () {
    return {
      showing: false,
    }
  },
}
</script>

<style lang="stylus" scoped>
.k-notifications-popover
  width 400px
</style>
