<template>
  <QList>
    <QItem>
      <QItemMain
        :label="$t('ISSUE.VOTING.RESULTS.ENDED_AT', { date: $d(voting.expiresAt, 'long') })"
        :sublabel="$t('ISSUE.VOTING.RESULTS.PARTICIPANTS', { number: voting.participantCount })"
      />
    </QItem>
    <template
      v-if="!isCancelled"
    >
      <QItem
        dense
        class="justify-end"
      >
        <QItemSide
          right
          :stamp="$t('ISSUE.VOTING.RESULTS.TOTAL_SCORE')"
        />
      </QItem>
      <QItem
        v-for="{ id, icon, label, isOutcome, sumScore} in options"
        :key="id"
        :class="{'text-secondary': isOutcome}"
      >
        <QItemSide
          :icon="icon"
          :color="isOutcome ? 'secondary' : 'primary'"
        />
        <QItemMain>
          {{ label }}
        </QItemMain>
        <QItemSide
          stamp
          :class="{'text-secondary': isOutcome}"
        >
          {{ sumScore }}
        </QItemSide>
      </QItem>
    </template>
    <QItem
      v-else
    >
      <QItemMain>
        <QItemTile label>
          {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED') }}
        </QItemTile>
        <QItemTile
          sublabel
        >
          {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_WHY') }}
          <ul>
            <li>
              {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_REASON_1') }}
            </li>
            <li>
              {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_REASON_2') }}
            </li>
          </ul>
        </QItemTile>
      </QItemMain>
    </QItem>
  </QList>
</template>

<script>
import {
  QList,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
} from 'quasar'

export default {
  components: {
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
  },
  props: {
    voting: {
      type: Object,
      required: true,
    },
    affectedUser: {
      type: Object,
      default: null,
    },
    groupName: {
      type: String,
      default: '',
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    options () {
      return this.voting.options.map(o => ({
        ...o,
        icon: this.getIcon(o.meanScore),
        label: this.getLabel(o.type),
        isOutcome: this.voting.acceptedOption === o.id,
      })).sort(function (a, b) {
        return b.sumScore - a.sumScore
      })
    },
  },
  methods: {
    getLabel (type) {
      if (!this.affectedUser) return
      return this.$t(`ISSUE.VOTING.${type.toUpperCase()}`, {
        userName: this.affectedUser.displayName,
        groupName: this.groupName,
      })
    },
    getIcon (meanScore) {
      if (meanScore > 0.5) {
        return 'fas fa-smile'
      }
      if (meanScore < -0.5) {
        return 'fas fa-frown'
      }
      return 'fas fa-meh'
    },
  },
}
</script>
