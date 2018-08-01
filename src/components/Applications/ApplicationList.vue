<template>
  <q-card>
    <ApplicationItem
      v-for="a in pendingApplications"
      :key="a.id"
      :application="a"
      @accept="$emit('forwardAccept', arguments[0], arguments[1])"
      @decline="$emit('forwardDecline', arguments[0], arguments[1])"
    />
    <ApplicationItem
      v-for="a in otherApplications"
      :key="a.id"
      :application="a"
    />
  </q-card>
</template>

<script>
import ApplicationItem from './ApplicationItem'
import { QCard } from 'quasar'

export default {
  components: {
    ApplicationItem, QCard,
  },
  props: {
    pendingApplications: {
      type: Array,
      default: null,
    },
    otherApplications: {
      type: Array,
      default: null,
    },
  },
  computed: {
  },
}
</script>

<style scoped lang="stylus">
</style>
