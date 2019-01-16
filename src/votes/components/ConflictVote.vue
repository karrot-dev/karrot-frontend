<template>
  <QCard>
    <QCardTitle>
      <p>How do you wish to resolve this conflict with Mara Sants?</p>
    </QCardTitle>
    <QCardMain>
      {{ $t('CONFLICT.DAYS_LEFT', { count: days }) }}
    </QCardMain>
  </QCard>
</template>

<script>
import {
  QCard,
  QCardTitle,
  QCardMain,
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
