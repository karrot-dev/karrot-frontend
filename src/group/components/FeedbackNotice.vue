<template>
  <div>
    <RouterLink :to="{name: 'giveFeedback'}">
      <QCard
        color="info"
        class="generic-padding notice"
      >
        <i class="fas fa-balance-scale on-left" />
        {{ $tc('PICKUPLIST.AVAILABLE_FEEDBACK', feedbackPossible.length, { count: feedbackPossible.length }) }}
      </QCard>
    </RouterLink>
  </div>
</template>

<script>
import { QCard } from 'quasar'

export default {
  components: { QCard },
  props: {
    feedbackPossible: { required: true, type: Array },
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
  color $primary !important
.q-card.notice:hover
  box-shadow: 1px 2px 2px 1px rgba(0,0,0,0.4)
</style>
