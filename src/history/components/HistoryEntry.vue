<template>
  <div>
    <q-item
      multiline
      class="clickable"
      :class="{'greyed': detailIsShown}"
      @click.native="toggleDetail"
    >
      <q-item-side>
        <HistoryProfilePictures
          :users="entry.users"
        />
      </q-item-side>
      <q-item-main>
        <q-item-tile>
          <span class="content">
            {{ entry.message }}
          </span>
        </q-item-tile>
        <q-item-tile
          stamp
          class="mobile-only text-weight-light"
        >
          <DateAsWords :date="entry.date" />
        </q-item-tile>
      </q-item-main>
      <q-item-side
        class="desktop-only"
        stamp
        right
      >
        <DateAsWords :date="entry.date" />
      </q-item-side>
    </q-item>
    <transition name="slide-toggle">
      <div
        @click.self="toggleDetail"
        class="detail-wrapper greyed"
        style="cursor: pointer"
        v-if="detailIsShown"
      >
        <HistoryDetail
          style="cursor: initial"
          :entry="entry"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import HistoryProfilePictures from '@/history/components/HistoryProfilePictures'
import DateAsWords from '@/utils/components/DateAsWords'
import HistoryDetail from '@/history/components/HistoryDetail'
import { QItem, QItemSide, QItemMain, QItemTile } from 'quasar'

export default {
  props: {
    entry: {
      required: true,
      type: Object,
    },
  },
  data () {
    return {
      detailIsShown: false,
    }
  },
  methods: {
    toggleDetail (event) {
      if (this.detailIsShown) {
        window.history.replaceState({}, null, `#${this.$route.path}`)
      }
      else {
        window.history.replaceState({}, null, this.$router.resolve({ name: 'historyDetail', params: { historyId: this.entry.id } }).href)
      }
      this.detailIsShown = !this.detailIsShown
    },
  },
  components: { HistoryProfilePictures, HistoryDetail, DateAsWords, QItem, QItemSide, QItemMain, QItemTile },
}
</script>
<style scoped lang="stylus">
@import '~slidetoggle'
.clickable
  transition padding .5s ease
  &:hover
    cursor pointer
    background-color rgb(235, 235, 235)
.clickable.greyed
  padding 1em 3em 10px 3em
.greyed
  background-color rgb(235, 235, 235)
.detail-wrapper
  padding: 0 2em
  padding-bottom 2em
</style>
