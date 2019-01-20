<template>
  <QCard>
    <QCardTitle>
      {{ $t('CONFLICT.VOTE.TIME_UP') }}
    </QCardTitle>
    <QCardMain>
      <div class="row no-wrap">
        <strong
          class="q-mr-sm"
          style="white-space: nowrap"
        >
          {{ $d(conflict.votings.expiresAt, 'long') }}
        </strong>
      </div>
      <div class="row">
        <small class="text-weight-light">
          <span>
            {{ $t('CONFLICT.VOTE.INITIATED_BY', { initiatorName: conflict.createdBy.displayName }) }}
            <DateAsWords :date="conflict.createdAt" />
          </span>
        </small>
      </div>
      <QList
        separator
      >
        <QItem>
          <QItemSide
            icon="fas fa-grin"
            color="secondary"
          />
          <QItemMain>
            {{ $t('CONFLICT.VOTE.OPTION_ONE', { userName: conflict.affectedUser.displayName, groupName: conflict.group.displayName }) }}
          </QItemMain>
          <QItemSide>
            {{ $d(meanScore) }}
          </QItemSide>
        </QItem>
      </QList>
    </QCardMain>
  </QCard>
</template>

<script>
import DateAsWords from '@/utils/components/DateAsWords'

import {
  QCard,
  QCardMain,
  QCardTitle,
  QList,
  QItem,
  QItemSide,
  QItemMain,
} from 'quasar'

export default {
  components: {
    QCard,
    QCardMain,
    QCardTitle,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    DateAsWords,
  },
  props: {
    conflict: {
      type: Object,
      required: true,
    },
  },
  computed: {
    meanScore () {
      return this.conflict && this.conflict.votings[0] && this.conflict.votings[0].options[0].meanScore
    },
  },
}
</script>
