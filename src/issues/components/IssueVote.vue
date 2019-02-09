<template>
  <QCard
    class="wrapper"
    :class="{showOverlay}">
    <QBtn
      v-if="showOverlay"
      class="absolute-center"
      style="z-index: 1"
      color="primary"
      @click="setToZero()"
      v-t="'ISSUE.VOTING.BTN_START'"
    />
    <div>
      <QCardTitle>
        {{ $t('CONFLICT.VOTING.HEADLINE', { userName: issue.affectedUser.displayName }) }}
      </QCardTitle>
      <QCardMain>
        {{ $t('ISSUE.VOTING.DAYS_LEFT', { count: days }) }}
        <QProgress
          :percentage="progress"
          style="height: 8px"
          color="secondary"
        />
      </QCardMain>
    </div>
    <div
      class="content"
    >
      <QBtn
        class="absolute-right"
        v-if="!showOverlay"
        round
        flat
        color="red"
        @click="setToNull()"
      >
        <QIcon name="fas fa-times" />
        <QTooltip
          v-t="'ISSUE.VOTING.BTN_DELETE'"
        />
      </QBtn>
      <QCardMain
        v-for="o in edit"
        :key="o.id"
      >
        {{ getTitle(o.type) }}
        <QSlider
          v-model="o.yourScore"
          :label-value="getLabel(o.yourScore)"
          :min="-2"
          :max="2"
          :step="1"
          label-always
          snap
          markers
        />
      </QCardMain>
      <QBtn
        type="submit"
        color="secondary"
        v-t="'BUTTON.SUBMIT'"
        @click="$emit('saveScores', results)"
      />
    </div>
  </QCard>
</template>

<script>
import {
  QCard,
  QCardTitle,
  QCardMain,
  QSlider,
  QProgress,
  QBtn,
  QIcon,
  QTooltip,
} from 'quasar'

import distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import differenceInHours from 'date-fns/difference_in_hours'
import cloneDeep from 'clone-deep'
// import { objectDiff } from '@/utils/utils'

export default {
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QSlider,
    QProgress,
    QBtn,
    QIcon,
    QTooltip,
  },
  props: {
    issue: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      edit: null,
    }
  },
  watch: {
    options: {
      immediate: true,
      handler (current, previous) {
        /*
        const changes = (current && previous) ? objectDiff(previous, current) : {}
        this.edit = cloneDeep({ ...this.edit, ...changes })
        */
        this.edit = cloneDeep(current)
      },
    },
  },
  computed: {
    days () {
      return distanceInWordsStrict(this.ongoingVoting.expiresAt, new Date())
    },
    progress () {
      return 100 - (differenceInHours(this.ongoingVoting.expiresAt, new Date()) / 168 * 100)
    },
    showOverlay () {
      if (!this.edit) return
      return this.edit.every(o => o.yourScore === null)
    },
    results () {
      return this.edit.map(o => ({
        score: o.yourScore,
        option: o.id,
      }))
    },
    ongoingVoting () {
      return this.issue.votings.find(v => !v.acceptedOption)
    },
    options () {
      return this.ongoingVoting.options
    },
  },
  methods: {
    getLabel (score) {
      switch (score) {
        case 0:
          return 'neutral'
        case 1:
          return 'agree'
        case 2:
          return 'strongly agree'
        case -1:
          return 'disagree'
        case -2:
          return 'strongly disagree'
      }
    },
    setToNull () {
      this.edit = this.edit.map(o => ({
        ...o,
        yourScore: null,
      }))
    },
    setToZero () {
      this.edit = this.edit.map(o => ({
        ...o,
        yourScore: 0,
      }))
    },
    getTitle (type) {
      return this.$t(`ISSUE.VOTING.${type.toUpperCase()}`, { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.name })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~slidetoggle'
.wrapper
  position relative
.showOverlay .content
  opacity 0.3
  filter blur(3px)
</style>
