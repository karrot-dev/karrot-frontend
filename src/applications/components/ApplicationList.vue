<template>
  <div class="bg-white">
    <QList no-border>
      <ApplicationItem
        v-for="a in pending"
        :key="a.id"
        :application="a"
        @accept="$emit('accept', arguments[0])"
        @decline="$emit('decline', arguments[0])"
        @openChat="$emit('openChat', arguments[0])"
      />
      <QItemSeparator />
      <QCollapsible
        v-if="otherApplications.length > 0"
        icon="fas fa-archive"
        :label="$t('APPLICATION.PAST')"
        :sublabel="othersSublabel"
        @show="showOthers = true"
        @hide="showOthers = false"
      >
        <template v-if="showOthers">
          <ApplicationItem
            v-for="a in otherApplications"
            :key="a.id"
            :application="a"
            @openChat="$emit('openChat', arguments[0])"
          />
        </template>
      </QCollapsible>
      <QItem
        v-if="canFetchPast"
        class="row justify-center"
      >
        <QBtn
          size="sm"
          :loading="fetchPastStatus.pending"
          @click="fetchPast"
        >
          {{ $t('BUTTON.SHOW_MORE') }}
        </QBtn>
      </QItem>
    </QList>
  </div>
</template>

<script>
import ApplicationItem from './ApplicationItem'
import paginationMixin from '@/utils/mixins/paginationMixin'
import {
  QCollapsible,
  QItemSeparator,
  QList,
  QItem,
  QBtn,
} from 'quasar'

export default {
  components: {
    ApplicationItem,
    QCollapsible,
    QItemSeparator,
    QList,
    QItem,
    QBtn,
  },
  mixins: [paginationMixin],
  props: {
    pending: {
      type: Array,
      default: null,
    },
    otherApplications: {
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
      return this.$tc('ENTRY', this.otherApplications.length, { count: this.otherApplications.length })
    },
  },
}
</script>
