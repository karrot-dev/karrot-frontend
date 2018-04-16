<template>
  <q-card
    class="no-mobile-margin no-shadow grey-border"
  >
    <RandomArt
      :seed="group.id"
      type="circles">
      <div class="art-overlay">
        <div
          class="header"
          v-t="showPublicDescription ? 'GROUPINFO.TITLE' : 'GROUP.DESCRIPTION_VERBOSE'"/>
        <div
          class="subtitle"
          v-if="showPublicDescription"
          v-t="'GROUP.PUBLIC_DESCRIPTION'"/>
      </div>
    </RandomArt>
    <div class="generic-padding actionButtons">
      <q-btn
        small
        round
        color="secondary"
        :icon="showPublicDescription ? 'fa-lock-alt' : 'fa-info-circle'"
        class="hoverScale "
        @click="showPublicDescription = !showPublicDescription"
      >
        <q-tooltip v-t="showPublicDescription ? 'GROUP.DESCRIPTION_VERBOSE' : 'GROUPINFO.META'" />
      </q-btn>
      <router-link :to="{name: 'groupEdit'}">
        <q-btn
          small
          round
          color="secondary"
          icon="fa-pencil-alt "
          class="hoverScale"
        >
          <q-tooltip v-t="'GROUP.EDIT'" />
        </q-btn>
      </router-link>
    </div>
    <q-item
      class="padding-top"
      multiline>
      <q-item-main>
        <Markdown
          v-if="this.showPublicDescription && group.publicDescription"
          :source="group.publicDescription"
        />
        <Markdown
          v-if="!this.showPublicDescription && group.description"
          :source="group.description"
        />
      </q-item-main>
    </q-item>
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
  data () {
    return {
      showPublicDescription: false,
    }
  },
  computed: {
    ...mapGetters({
      group: 'currentGroup/value',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.actionButtons
  margin-top -36px
  float right
  .q-btn
    margin 3px

.padding-top
  padding-top 25px

.art-overlay
  color white
  padding 3em 2em 1em 1em
  background linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,$groupNavOverlay) 58%, rgba(0,0,0,0) 90%)
  .header
    font-size 1.3em
  .subtitle
    margin-top 6px
body.mobile .art-overlay
  padding 10px
  padding-top 1.6em
  padding-bottom 20px
  background rgba(0,0,0,$groupNavOverlay)
</style>
