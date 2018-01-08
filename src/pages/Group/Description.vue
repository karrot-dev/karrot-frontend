<template>
  <q-card
    class="no-shadow grey-border"
  >
    <div class="group-banner">
      <RandomArt
        :seed="group.id"
        type="circles" />
    </div>
    <div class="generic-padding">
      <div
        class="actionButtons"
        v-if="!$q.platform.is.mobile">
        <router-link :to="{name: 'groupPreview', params: {groupPreviewId: group.id}}">
          <q-btn
            small
            round
            color="secondary"
            icon="fa-info-circle"
            class="hoverScale"
          >
            <q-tooltip v-t="'GROUPINFO.META'" />
          </q-btn>
        </router-link>
        <router-link :to="{name: 'groupEdit'}">
          <q-btn
            small
            round
            color="secondary"
            icon="fa-pencil"
            class="hoverScale"
          >
            <q-tooltip v-t="'GROUP.EDIT'" />
          </q-btn>
        </router-link>
      </div>
      <q-item multiline>
        <q-item-main>
          <Markdown
            v-if="group.description"
            :source="group.description"
          />
        </q-item-main>
      </q-item>
    </div>
  </q-card>
</template>

<script>
import { QCard, QItem, QItemMain, QItemSide, QBtn, QTooltip } from 'quasar'
import Markdown from '@/components/Markdown'
import RandomArt from '@/components/General/RandomArt'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { QCard, RandomArt, QItem, QItemMain, QItemSide, QBtn, QTooltip, Markdown },
  computed: {
    ...mapGetters({
      group: 'currentGroup/value',
    }),
  },
}
</script>

<style scoped lang="stylus">
.actionButtons
  margin-top -36px
  float right
  .q-btn
    margin 3px

.group-banner > span
    display: block
    height 5vw
    min-height 30px
    max-height 48px
    overflow hidden

body.mobile .group-banner
  border 0
  max-height: 30px
  overflow: hidden
</style>
