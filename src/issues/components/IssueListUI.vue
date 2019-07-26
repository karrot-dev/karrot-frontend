<template>
  <QList
    no-border
    class="bg-white"
  >
    <KSpinner v-show="isPending" />
    <IssueItem
      v-for="issue in ongoingIssues"
      :key="issue.id"
      :issue="issue"
    />
    <KNotice v-if="hasNoOngoing">
      <template slot="icon">
        <i class="fas fa-bed" />
      </template>
      {{ $t('ISSUE.NO_ONGOING') }}
    </KNotice>
    <QSeparator />
    <QExpansionItem
      v-if="pastIssues.length > 0"
      icon="fas fa-archive"
      :label="$t('ISSUE.PAST')"
      :sublabel="othersSublabel"
      @show="showOthers = true"
      @hide="showOthers = false"
    >
      <template v-if="showOthers">
        <IssueItem
          v-for="issue in pastIssues"
          :key="issue.id"
          :issue="issue"
        />
      </template>
    </QExpansionItem>
  </QList>
</template>

<script>
import IssueItem from './IssueItem'
import KSpinner from '@/utils/components/KSpinner'
import KNotice from '@/utils/components/KNotice'

import statusMixin from '@/utils/mixins/statusMixin'

import {
  QExpansionItem,
  QSeparator,
  QList,
} from 'quasar'

export default {
  components: {
    IssueItem,
    KSpinner,
    KNotice,
    QExpansionItem,
    QSeparator,
    QList,
  },
  mixins: [statusMixin],
  props: {
    ongoingIssues: {
      type: Array,
      default: null,
    },
    pastIssues: {
      type: Array,
      default: null,
    },
  },
  data () {
    return {
      showOthers: false,
    }
  },
  computed: {
    othersSublabel () {
      return this.$tc('ENTRY', this.pastIssues.length, { count: this.pastIssues.length })
    },
    hasNoOngoing () {
      return !this.isPending && this.ongoingIssues && this.ongoingIssues.length < 1
    },
  },
}
</script>
