<template>
  <q-card
    class="no-shadow generic-padding grey-border"
    style="width: 100%"
  >
    <q-item multiline>
      <q-item-main>
        <Markdown
          v-if="group.description"
          :source="group.description"
        />
      </q-item-main>
      <q-item-side right>
        <router-link :to="{name: 'groupEdit'}">
          <q-btn
            small
            round
            color="secondary"
            icon="fa-pencil"
          >
            <q-tooltip v-t="'GROUP.EDIT'" />
          </q-btn>
        </router-link>
      </q-item-side>
    </q-item>
  </q-card>
</template>

<script>
import { QCard, QItem, QItemMain, QItemSide, QBtn, QTooltip } from 'quasar'
import Markdown from '@/components/Markdown'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { QCard, QItem, QItemMain, QItemSide, QBtn, QTooltip, Markdown },
  computed: {
    ...mapGetters({
      group: 'currentGroup/value',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
