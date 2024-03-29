<template>
  <QList
    bordered
  >
    <QItem>
      <QItemSection>
        <QItemLabel>
          {{ $t('ISSUE.VOTING.RESULTS.ENDED_AT', { date: $d(voting.expiresAt, 'long') }) }}
        </QItemLabel>
        <QItemLabel caption>
          {{ $t('ISSUE.VOTING.RESULTS.PARTICIPANTS', { number: voting.participantCount }) }}
        </QItemLabel>
      </QItemSection>
    </QItem>
    <template
      v-if="!isCancelled"
    >
      <QItem
        dense
        class="justify-end"
      >
        <QItemSection side>
          {{ $t('ISSUE.VOTING.RESULTS.TOTAL_SCORE') }}
        </QItemSection>
      </QItem>
      <QItem
        v-for="{ id, icon, label, isOutcome, sumScore} in options"
        :key="id"
        :class="{'text-secondary': isOutcome}"
      >
        <QItemSection side>
          <QIcon
            :name="icon"
            :color="isOutcome ? 'secondary' : 'primary'"
          />
        </QItemSection>
        <QItemSection>
          {{ label }}
        </QItemSection>
        <QItemSection
          side
          :class="{'text-secondary': isOutcome}"
        >
          {{ sumScore }}
        </QItemSection>
      </QItem>
    </template>
    <QItem
      v-else
    >
      <QItemSection>
        <QItemLabel>
          {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED') }}
        </QItemLabel>
        <QItemLabel caption>
          {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_WHY') }}
          <ul>
            <li>
              {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_REASON_1') }}
            </li>
            <li>
              {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_REASON_2') }}
            </li>
          </ul>
        </QItemLabel>
      </QItemSection>
    </QItem>
  </QList>
</template>

<script>
import {
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
} from 'quasar'

export default {
  components: {
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
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
        icon: this.getIcon(this.calculateMeanScore(o)),
        label: this.getLabel(o.type),
        isOutcome: this.voting.acceptedOption === o.id,
      })).sort(function (a, b) {
        return b.sumScore - a.sumScore
      })
    },
  },
  methods: {
    calculateMeanScore (option) {
      return this.voting.participantCount ? option.sumScore / this.voting.participantCount : null
    },
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
