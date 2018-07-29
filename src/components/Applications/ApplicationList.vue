<template>
  <q-card>
    <ApplicationItem
      v-for="a in groupApplications"
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
    groupApplications: {
      type: Array,
      default: null,
    },
  },
  methods: {
  },
  computed: {
  },
}
</script>

<style scoped lang="stylus">
</style>
