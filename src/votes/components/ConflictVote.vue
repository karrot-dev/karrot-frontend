<template>
  <div>
    <QCard
      v-if="!conflict.isDecided"
      class="wrapper"
      :class="{showOverlay}">
      <QBtn
        v-if="showOverlay"
        class="absolute-center"
        style="z-index: 1"
        color="primary"
        @click="value = 0"
        v-t="'CONFLICT.VOTE.VOTING'"
      />
      <div>
        <QCardTitle>
          {{ $t('CONFLICT.VOTE.HEADLINE', { userName: conflict.affectedUser.displayName }) }}
        </QCardTitle>
        <QCardMain>
          {{ $t('CONFLICT.VOTE.DAYS_LEFT', { count: days }) }}
          <QProgress
            :percentage="progress"
            style="height: 8px"
            color="secondary"
          />
          <QBtn
            label="test"
            type="button"
            @click="test"
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
          @click="value = null"
        >
          <QIcon name="fas fa-times" />
          <QTooltip
            v-t="'CONFLICT.VOTE.DELETE'"
          />
        </QBtn>
        <QCardMain>
          {{ $t('CONFLICT.VOTE.OPTION_ONE', { userName: conflict.affectedUser.displayName, groupName: conflict.group.displayName }) }}
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
          {{ $t('CONFLICT.VOTE.OPTION_TWO') }}
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
          {{ $t('CONFLICT.VOTE.OPTION_THREE', { userName: conflict.affectedUser.displayName, groupName: conflict.group.displayName }) }}
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
        <QCardMain>
          {{ $t('CONFLICT.VOTE.OPTION_FOUR') }}
          <QSlider
            v-model="marker4"
            :label-value="fancylabels(marker4)"
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
          v-t="value != null ? 'BUTTON.CREATE' : null"
        />
      </div>
    </QCard>
    <QCard
      v-if="conflict.isDecided">
      <ConflictResults
        :conflict="conflict"
      />
    </QCard>
    <QList>
      <ConflictHistoryItem
        v-for="v in conflict.votings"
        :key="v.id"
        :conflict="conflict"
      />
    </QList>
  </div>
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
  QList,
} from 'quasar'

import addDays from 'date-fns/add_days'
import distanceInWordsStrict from 'date-fns/distance_in_words_strict'
import differenceInHours from 'date-fns/difference_in_hours'
import ConflictHistoryItem from './ConflictHistoryItem'
import ConflictResults from './ConflictResults'

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
    ConflictHistoryItem,
    ConflictResults,
    QList,
  },
  props: {
    conflict: {
      type: Object,
      required: true,
    },
    value: {
      type: Number,
      default: null,
    },
  },
  data () {
    return {
      marker1: 0,
      marker2: 0,
      marker3: 0,
      marker4: 0,
    }
  },
  computed: {
    days () {
      return distanceInWordsStrict(addDays(this.conflict.createdAt, 7), new Date())
    },
    progress () {
      return differenceInHours(new Date(), this.conflict.createdAt) / 168 * 100
    },
    showOverlay () {
      return this.value === null
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

    test () {
      const difference = distanceInWordsStrict(
        addDays(this.conflict.createdAt, 1),
        new Date(),
      )
      console.log(difference)
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
