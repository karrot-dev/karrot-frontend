<template>
  <div>
    <QCard
      color="secondary"
      class="generic-padding notice no-margin-bottom"
      @click.native="showPickups = !showPickups"
    >
      <i class="fas fa-shopping-basket on-left" />
      {{ $tc('PICKUPLIST.JOINEDNOTICE', pickups.length, { count: pickups.length }) }}
      <div
        class="card-arrow"
        :class="{ upsideDown: showPickups }"
      >
        <i class="fas fa-angle-down" />
      </div>
    </QCard>
    <PickupList
      v-if="showPickups"
      :pickups="pickups"
      place-link
      @join="$emit('join', arguments[0])"
      @leave="$emit('leave', arguments[0])"
      @detail="$emit('detail', arguments[0])"
    />
    <hr v-if="showPickups">
  </div>
</template>

<script>
import PickupList from '@/pickups/components/PickupList'
import { QCard } from 'quasar'

export default {
  components: { PickupList, QCard },
  props: {
    pickups: { required: true, type: Array },
  },
  data () {
    return {
      showPickups: true,
    }
  },
}
</script>

<style scoped lang="stylus">
.q-card.notice
  cursor pointer
  transition: all .2s ease;
  .card-arrow
    float: right
    transition: all .3s ease;
  .upsideDown
    transform rotate(180deg)
.q-card.notice:hover
  box-shadow: 1px 2px 2px 1px rgba(0,0,0,0.4)
hr
  margin 1em 2em
  border solid lightgrey 1px;
.no-margin-bottom
  margin-bottom 0
</style>
