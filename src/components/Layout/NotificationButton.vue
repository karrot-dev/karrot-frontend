<template>
  <q-btn
    :to="$q.platform.is.mobile && ({ name: 'notifications' })"
    flat
    dense
    round
    @click="maybeOpen"
  >
    <q-icon
      name="fas fa-bell"
    />
    <q-chip
      v-if="unseenCount > 0"
      floating
      color="secondary"
    >
      {{ unseenCount }}
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

import { mapGetters } from 'vuex'

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
.k-notifications-popover
  width 400px
</style>
