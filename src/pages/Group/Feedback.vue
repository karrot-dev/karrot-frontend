<template>
  <q-card
    class="no-shadow generic-padding grey-border"
    style="width: 100%"
  >
    <PickupFeedback/>
  </q-card>
</template>

<script>
import PickupFeedback from '@/components/Statistics/PickupFeedback'
import { QCard } from 'quasar'

export default {
  components: { PickupFeedback, QCard },
}
</script>
