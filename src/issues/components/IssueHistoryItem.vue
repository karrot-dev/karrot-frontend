<template>
  <div>
    <QItem
      multiline
      link
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
          <DateAsWords :date="voting.expiresAt" />
        </QItemTile>
      </QItemMain>
      <QItemSide
        class="desktop-only"
        stamp
        right
      >
        <DateAsWords :date="voting.expiresAt" />
      </QItemSide>
    </QItem>
    <Transition name="slide-toggle">
      <div
        @click.self="toggleDetail"
        class="detail-wrapper greyed"
        style="cursor: pointer"
        v-if="detailIsShown"
      >
        <VotingResults
          style="cursor: initial"
          :voting="voting"
          :affected-user="affectedUser"
          :group-name="groupName"
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
import VotingResults from './VotingResults'

export default {
  components: {
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    DateAsWords,
    VotingResults,
  },
  props: {
    voting: {
      type: Object,
      default: null,
    },
    affectedUser: {
      type: Object,
      default: null,
    },
    groupName: {
      type: String,
      default: '',
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
