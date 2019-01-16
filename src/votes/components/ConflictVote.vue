<template>
  <QCard>
    <QCardTitle>
      {{ $t('CONFLICT.VOTE.HEADLINE', { userName: conflict.affectedUser.displayName }) }}
    </QCardTitle>
    <QCardMain>
      {{ $t('CONFLICT.VOTE.DAYS_LEFT', { count: days }) }}
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
