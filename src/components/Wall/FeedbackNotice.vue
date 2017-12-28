<template>
  <div>
    <router-link :to="{name: 'pickupFeedback'}">
      <q-card
        color="warning"
        class="generic-padding notice"
      >
        <i class="fa fa-balance-scale on-left"/>
        {{ $tc('PICKUPLIST.AVAILABLE_FEEDBACK', 2, { count: 2 }) }}
      </q-card>
    </router-link>
  </div>
</template>

<script>
import { QCard } from 'quasar'

export default {
  components: { QCard },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.list-leave-active
  transition: all .5s
.list-leave-to
  opacity: 0
  transform: translateX(-50px)
.q-card.notice
  cursor pointer
  transition: all .2s ease;
  color $primary !important
.q-card.notice:hover
  box-shadow: 1px 2px 2px 1px rgba(0,0,0,0.4)
</style>
