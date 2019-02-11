<template>
  <div>
    <QItem
      multiline
      class="clickable"
      :class="{'greyed': detailIsShown}"
      @click.native="toggleDetail"
    >
      <QItemMain>
        <QItemTile>
          {{ $t('ISSUE.VOTING.RESULTS.KEEP_DISCUSSING') }}
        </QItemTile>
        <QItemTile
          stamp
          class="mobile-only text-weight-light"
        >
          <DateAsWords :date="issue.createdAt" />
        </QItemTile>
      </QItemMain>
      <QItemSide
        class="desktop-only"
        stamp
        right
      >
        <DateAsWords :date="issue.createdAt" />
      </QItemSide>
    </QItem>
    <Transition name="slide-toggle">
      <div
        @click.self="toggleDetail"
        class="detail-wrapper greyed"
        style="cursor: pointer"
        v-if="detailIsShown"
      >
        <IssueResults
          style="cursor: initial"
          :issue="issue"
        />
      </div>
    </Transition>
  </div>
</template>

<script>
import {
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
} from 'quasar'

import DateAsWords from '@/utils/components/DateAsWords'
import IssueResults from './IssueResults'

export default {
  components: {
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    DateAsWords,
    IssueResults,
  },
  props: {
    issue: {
      type: Object,
      default: null,
    },
  },
  methods: {
    toggleDetail (event) {
      this.detailIsShown = !this.detailIsShown
    },
  },
  data () {
    return {
      detailIsShown: false,
    }
  },
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
