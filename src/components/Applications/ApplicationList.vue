<template>
  <q-card>
    <ApplicationItem
      v-for="a in pending"
      :key="a.id"
      :application="a"
      @accept="$emit('accept', arguments[0])"
      @decline="$emit('decline', arguments[0])"
    />
    <q-collapsible
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
    </q-collapsible>
  </q-card>
</template>

<script>
import ApplicationItem from './ApplicationItem'
import { QCard, QCollapsible } from 'quasar'

export default {
  components: {
    ApplicationItem, QCard, QCollapsible,
  },
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

<style scoped lang="stylus">
</style>
