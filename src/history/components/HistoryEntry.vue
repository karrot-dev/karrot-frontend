<template>
  <div>
    <QItem
      class="clickable"
      clickable
      :class="{'greyed': detailIsShown}"
      @click="toggleDetail"
    >
      <QItemSection avatar>
        <HistoryProfilePictures
          :users="entry.users"
        />
      </QItemSection>
      <QItemSection>
        <QItemLabel>
          <span class="content">
            {{ entry.message }}
          </span>
        </QItemLabel>
        <QItemLabel
          stamp
          class="mobile-only text-weight-light"
        >
          <DateAsWords :date="entry.date" />
        </QItemLabel>
      </QItemSection>
      <QItemSection
        class="desktop-only"
        side
      >
        <DateAsWords :date="entry.date" />
      </QItemSection>
    </QItem>
    <Transition name="slide-toggle">
      <div
        v-if="detailIsShown"
        class="detail-wrapper greyed"
        style="cursor: pointer"
        @click.self="toggleDetail"
      >
        <HistoryDetail
          style="cursor: initial"
          :entry="entry"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import HistoryProfilePictures from '@/history/components/HistoryProfilePictures'
import DateAsWords from '@/utils/components/DateAsWords'
import HistoryDetail from '@/history/components/HistoryDetail'
import {
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'

export default {
  components: {
    HistoryProfilePictures,
    HistoryDetail,
    DateAsWords,
    QItem,
    QItemSection,
    QItemLabel,
  },
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
}
</script>
<style scoped lang="stylus">
@import '~slidetoggle'
.clickable
  transition padding .5s ease
  &:hover
    background-color rgb(235, 235, 235)
.clickable.greyed
  padding 1em 3em 10px 3em
.greyed
  background-color rgb(235, 235, 235)
.detail-wrapper
  padding: 0 2em
  padding-bottom 2em
</style>
