<template>
  <q-card>
    <ApplicationItem
      v-for="a in groupApplications"
      :key="a.id"
      :application="a"
      @forwardAccept="$emit('accept', a.id)"
      @test="test"
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
    test () {
      return console.log('I am a working button!')
    },
  },
  computed: {
  },
}
</script>

<style scoped lang="stylus">
</style>
