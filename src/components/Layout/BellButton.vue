<template>
  <q-btn
    :to="$q.platform.is.mobile && ({ name: 'bells' })"
    flat
    dense
    round
    @click="maybeOpen"
  >
    <q-icon
      name="fas fa-bell"
    />
    <q-chip
      v-if="unreadCount > 0"
      floating
      color="secondary"
    >
      {{ unreadCount }}
    </q-chip>
    <q-popover
      v-if="!$q.platform.is.mobile"
      v-model="showing"
      class="k-bells-popover"
    >
      <Bells
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
const Bells = () => import('@/components/Layout/Bells')

import { mapGetters } from 'vuex'

export default {
  components: {
    QBtn,
    QIcon,
    QChip,
    QPopover,
    Bells,
  },
  computed: {
    ...mapGetters({
      unreadCount: 'bells/unreadCount',
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
.k-bells-popover
  width 400px
</style>
