<template>
  <div>
    <q-card class="no-shadow generic-padding grey-border" style="width: 100%">
      <Markdown v-if="group.description" :source="group.description" />
    </q-card>
  </div>
</template>

<script>
import { QCard } from 'quasar'
import Markdown from '@/components/Markdown'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { QCard, Markdown },
  computed: {
    ...mapGetters({
      group: 'currentGroup/value',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
