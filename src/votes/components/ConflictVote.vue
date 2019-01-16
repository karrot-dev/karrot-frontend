<template>
  <QCard>
    <QCardTitle>
      {{ $t('CONFLICT.VOTE.HEADLINE', { userName: conflict.affectedUser.displayName }) }}
    </QCardTitle>
    <QCardMain>
      {{ $t('CONFLICT.VOTE.DAYS_LEFT', { count: days }) }}
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
  props: {
    conflict: {
      type: Object,
      required: true,
    },
  },
  components: {
    QCard,
    QCardTitle,
    QCardMain,
    QSlider,
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
