<template>
  <div>
    <q-card
      class="no-padding no-shadow grey-border"
    >
      <div>
        <StoreHistory class="padding-top"/>
      </div>
    </q-card>
  </div>
</template>

<script>
import { QCard, QBtn, QTooltip } from 'quasar'
import StoreHistory from '@/history/components/StoreHistory'

export default {
  components: { StoreHistory, QCard, QBtn, QTooltip },
}
</script>

<style scoped lang="stylus">
.padding-top
  padding-top 15px
</style>
