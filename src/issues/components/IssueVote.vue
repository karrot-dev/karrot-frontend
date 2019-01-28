<template>
  <QCard
    class="wrapper"
    :class="{showOverlay}">
    <QBtn
      v-if="showOverlay"
      class="absolute-center"
      style="z-index: 1"
      color="primary"
      @click="setToZero"
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
        @click="setToNull"
      >
        <QIcon name="fas fa-times" />
        <QTooltip
          v-t="'ISSUE.VOTING.BTN_DELETE'"
        />
      </QBtn>
      <QCardMain
        v-for="(o, index) in issue.votings[0].options"
        :key="o.id"
      >
        {{ getTitle(o.type) }}
        <QSlider
          v-model="scores[index]"
          :label-value="getLabel(scores[index])"
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
        v-t="'BUTTON.CREATE'"
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
      scores: this.issue.votings[0].options.map(o => o.yourScore),
    }
  },
  computed: {
    days () {
      return distanceInWordsStrict(this.issue.votings[0].expiresAt, new Date())
    },
    progress () {
      return differenceInHours(new Date(), this.issue.createdAt) / 168 * 100
    },
    showOverlay () {
      return this.scores.every(s => s === null)
    },
    results () {
      let resultsArray = []
      for (let i = 0; i < this.issue.votings[0].options.length; i++) {
        resultsArray[i] = {
          option: this.issue.votings[0].options[i].id,
          score: this.scores[i],
        }
      }
      return resultsArray
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
      for (let i = 0; i < this.scores.length; i++) {
        this.$set(this.scores, i, null)
      }
    },
    setToZero () {
      for (let i = 0; i < this.scores.length; i++) {
        this.$set(this.scores, i, 0)
      }
    },
    getTitle (type) {
      switch (type) {
        case ('no_change'):
          return this.$t('ISSUE.VOTING.CONFLICT_ONE', { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.name })
        case ('remove_user'):
          return this.$t('ISSUE.VOTING.CONFLICT_THREE', { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.name })
        case ('further_discussion'):
          return this.$t('ISSUE.VOTING.CONFLICT_TWO')
      }
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
