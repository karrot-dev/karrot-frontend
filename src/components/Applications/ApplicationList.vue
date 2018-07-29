<template>
  <q-card>
    <ApplicationItem
      v-for="a in groupApplications"
      :key="a.id"
      :application="a"
      @accept="forwardAccept"
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
    forwardAccept (applicationId) {
      return this.$emit('accept', applicationId)
    },
  },
  computed: {
  },
}
</script>

<style scoped lang="stylus">
</style>
