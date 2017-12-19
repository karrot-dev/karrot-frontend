<template>
  <q-card>
    <q-card-title>
      {{ feedback.weight }} kg
    </q-card-title>
    <q-card-main>
      {{ feedback.comment }}
    </q-card-main>
  </q-card>
</template>

<script>
import { QCard, QCardMain, QCardTitle } from 'quasar'

export default {
  props: {
    feedback: { required: true },
  },
  components: {
    QCard, QCardMain, QCardTitle,
  },
  computed: {
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
