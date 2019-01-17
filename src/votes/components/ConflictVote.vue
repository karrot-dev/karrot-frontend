<template>
  <QCard>
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
} from 'quasar'

import addDays from 'date-fns/add_days'
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
  },
  props: {
    conflict: {
      type: Object,
      required: true,
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
