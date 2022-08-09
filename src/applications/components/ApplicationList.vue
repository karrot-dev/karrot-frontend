<template>
  <div class="bg-white">
    <QList bordered>
      <ApplicationItem
        v-for="a in pendingApplications"
        :key="a.id"
        v-measure
        :application="a"
      />
      <QSeparator />
      <QExpansionItem
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
          />
        </template>
      </QExpansionItem>
      <QItem
        v-if="canFetchPast"
        class="row justify-center"
      >
        <QBtn
          size="sm"
          :loading="isLoading"
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
  QExpansionItem,
  QSeparator,
  QList,
  QItem,
  QBtn,
} from 'quasar'

export default {
  components: {
    ApplicationItem,
    QExpansionItem,
    QSeparator,
    QList,
    QItem,
    QBtn,
  },
  mixins: [paginationMixin],
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    pendingApplications: {
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
