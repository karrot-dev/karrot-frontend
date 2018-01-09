<template>
  <q-card
    class="no-mobile-margin no-shadow grey-border"
  >
    <RandomArt
      :seed="group.id"
      type="circles">
      <div class="art-overlay"/>
    </RandomArt>
    <div class="generic-padding">
      <div class="actionButtons">
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
      <q-item
        class="content"
        multiline>
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

.content
  margin-top 10px

body.mobile .art-overlay
  width 100%
  height 30px
  background linear-gradient(to bottom, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)
</style>
