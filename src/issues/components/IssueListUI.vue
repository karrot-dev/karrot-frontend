<template>
  <div class="bg-white">
    <QList no-border>
      <IssueItem
        v-for="i in ongoingIssues"
        :key="i.id"
        :issue="i"
        @open="openCheck"
      />
      <QItemSeparator />
      <QCollapsible
        v-if="pastIssues.length > 0"
        icon="fas fa-archive"
        :label="$t('ISSUES.PAST')"
        :sublabel="othersSublabel"
        @show="showOthers = true"
        @hide="showOthers = false"
      >
        <template v-if="showOthers">
          <IssueItem
            v-for="i in pastIssues"
            :key="i.id"
            :issue="i"
            @open="$emit('open', arguments[0])"
          />
        </template>
      </QCollapsible>
    </QList>
  </div>
</template>

<script>
import IssueItem from './IssueItem'
import {
  QCollapsible,
  QItemSeparator,
  QList,
} from 'quasar'

export default {
  components: {
    IssueItem,
    QCollapsible,
    QItemSeparator,
    QList,
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
  },
  methods: {
    openCheck (stuff) {
      console.log('In the List: ', stuff.id)
      this.$emit('open', stuff)
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
