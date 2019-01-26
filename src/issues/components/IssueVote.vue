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
      <QBtn
        label="test"
        @click="test"
      />
      <QCardMain>
        {{ $t('CONFLICT.VOTING.OPTION_ONE', { userName: issue.affectedUser.displayName, groupName: issue.group.name }) }}
        <QSlider
          v-model="marker1"
          :label-value="fancylabels(marker1)"
          :min="-2"
          :max="2"
          :step="1"
          label-always
          snap
          markers
        />
      </QCardMain>
      <QCardMain>
        {{ $t('CONFLICT.VOTING.OPTION_TWO') }}
        <QSlider
          v-model="marker2"
          :label-value="fancylabels(marker2)"
          :min="-2"
          :max="2"
          :step="1"
          label-always
          snap
          markers
        />
      </QCardMain>
      <QCardMain>
        {{ $t('CONFLICT.VOTING.OPTION_THREE', { userName: issue.affectedUser.displayName, groupName: issue.group.name }) }}
        <QSlider
          v-model="marker3"
          :label-value="fancylabels(marker3)"
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
        @click="$emit('saveVote', [marker1, marker2, marker3, marker4])"
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
      marker1: this.issue.votings[0].options[0].yourScore,
      marker2: this.issue.votings[0].options[1].yourScore,
      marker3: this.issue.votings[0].options[2].yourScore,
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
      return (this.marker1 && this.marker2 && this.marker3) === null
    },
  },
  methods: {
    fancylabels (vote) {
      switch (vote) {
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
      this.marker1 = null
      this.marker2 = null
      this.marker3 = null
    },
    setToZero () {
      this.marker1 = 0
      this.marker2 = 0
      this.marker3 = 0
    },
    test () {
      console.log(this.issue.votings[0].options[2].id)
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
