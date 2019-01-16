<template>
  <QCard>
    <QCardTitle>
      {{ $t('CONFLICT.VOTE.HEADLINE', { userName: conflict.affectedUser.displayName }) }}
    </QCardTitle>
    <QCardMain
      class="relative-position fixed-center"
    >
      {{ $t('CONFLICT.VOTE.DAYS_LEFT', { count: days }) }}
    </QCardMain>
    <QCardMain>
      {{ $t('CONFLICT.VOTE.OPTION_ONE', { userName: conflict.affectedUser.displayName, groupName: conflict.group.displayName }) }}
      <QSlider
        v-model="marker"
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
        v-model="marker"
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
        v-model="marker"
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
        v-model="marker"
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
} from 'quasar'
import differenceInDays from 'date-fns/difference_in_days'
import addDays from 'date-fns/add_days'

export default {
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QSlider,
  },
  props: {
    conflict: {
      type: Object,
      required: true,
    },
  },
  data () {
    return {
      marker: 0,
    }
  },
  computed: {
    days () {
      const now = new Date()
      const endDate = addDays(this.conflict.createdAt, 7)
      return differenceInDays(endDate, now)
    },
  },
  methods: {
    test () {
      console.log(this.days)
    },
  },
}
</script>
