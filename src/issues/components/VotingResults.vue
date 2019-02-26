<template>
  <div>
    <QItemMain>
      <div>
        <strong
          class="q-mr-sm"
        >
          {{ $t('ISSUE.VOTING.RESULTS.ENDED_AT', { date: $d(voting.expiresAt, 'long') }) }}
        </strong>
      </div>
      <div
        class="q-pt-xs"
      >
        {{ $t('ISSUE.VOTING.RESULTS.PARTICIPANTS', { number: voting.participantCount }) }}
      </div>
      <QItemSide
        v-if="!isCancelled"
        right
        stamp="Total score"
      />
    </QItemMain>
    <QList
      v-if="!isCancelled"
      no-border
    >
      <QItem
        v-for="(o, index) in sortedOptions"
        :key="o.id"
      >
        <QItemSide
          :icon="getIcon(index)"
          color="primary"
        />
        <QItemMain>
          {{ displayOutcomes(index) }}
        </QItemMain>
        <QItemSide>
          {{ sortedOptions[index].sumScore }}
        </QItemSide>
      </QItem>
    </QList>
    <QItem
      v-if="isCancelled"
    >
      <QItemMain
        class="q-pt-md"
      >
        <strong>
          {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED') }}
        </strong>
        <QItemTile
          class="q-pt-sm"
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
  </div>
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
    sortedOptions () {
      return this.voting.options.slice().sort(function (a, b) {
        return b.sumScore - a.sumScore
      })
    },
  },
  methods: {
    displayOutcomes (index) {
      if (!this.affectedUser) return
      return this.$t(`ISSUE.VOTING.${this.sortedOptions[index].type.toUpperCase()}`, { userName: this.affectedUser.displayName, groupName: this.groupName })
    },
    getIcon (index) {
      if (this.sortedOptions[index].sumScore > 0) {
        return 'fas fa-smile'
      }
      if (this.sortedOptions[index].sumScore < 0) {
        return 'fas fa-frown'
      }
      return 'fas fa-meh'
    },
  },
}
</script>
