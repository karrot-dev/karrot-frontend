<template>
  <div class="q-mt-lg">
    <KSpinner v-show="isPending" />
    <KNotice v-if="hasNoOngoing">
      <template #icon>
        <QIcon class="fas fa-bed" />
      </template>
      {{ $t('ISSUE.NO_ONGOING') }}
    </KNotice>
    <QList
      class="bg-white q-mt-md"
      bordered
    >
      <IssueItem
        v-for="issue in ongoingIssues"
        :key="issue.id"
        v-measure
        :issue="issue"
      />
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
  </div>
</template>

<script>
import {
  QExpansionItem,
  QSeparator,
  QList,
  QIcon,
} from 'quasar'

import KNotice from '@/utils/components/KNotice'
import KSpinner from '@/utils/components/KSpinner'

import IssueItem from './IssueItem'

export default {
  components: {
    IssueItem,
    KSpinner,
    KNotice,
    QExpansionItem,
    QSeparator,
    QList,
    QIcon,
  },
  props: {
    ongoingIssues: {
      type: Array,
      default: null,
    },
    pastIssues: {
      type: Array,
      default: null,
    },
    isPending: {
      type: Boolean,
      default: false,
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
