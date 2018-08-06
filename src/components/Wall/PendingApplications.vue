<template>
  <div>
    <router-link :to="{name: 'groupApplications'}">
      <q-card
        color="blue"
        class="generic-padding notice"
      >
        <i class="fas fa-address-card on-left"/>
        {{ $tc('APPLICATION.WALL_NOTICE', pending.length, { count: pending.length }) }}
      </q-card>
    </router-link>
  </div>
</template>

<script>
import { QCard } from 'quasar'

export default {
  components: { QCard },
  props: {
    pending: {
      required: true,
      type: Array,
    },
  },
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
  color white !important
.q-card.notice:hover
  box-shadow: 1px 2px 2px 1px rgba(0,0,0,0.4)
</style>
