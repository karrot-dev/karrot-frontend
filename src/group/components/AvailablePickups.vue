<template>
  <div>
    <QCard
      color="info"
      class="notice q-mb-none"
    >
      <div
        class="q-pa-md toggle-button"
        @click="showPickups = !showPickups"
      >
        <i class="fas fa-star on-left" />
        {{ $tc('PICKUPLIST.AVAILABLE', pickups.length, { count: pickups.length }) }}
        <div
          class="card-arrow"
          :class="{ upsideDown: showPickups }"
        >
          <i class="fas fa-angle-down" />
        </div>
      </div>
      <template v-if="showPickups">
        <QCardSeparator />
        <div
          class="q-px-md q-py-sm bg-grey-2 q-caption"
        >
          <i class="fas fa-info-circle on-left" />
          {{ $t('PICKUPLIST.AVAILABLE_FROM_STORES') }}
        </div>
      </template>
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
import {
  QCard,
  QCardSeparator,
} from 'quasar'

export default {
  components: {
    PickupList,
    QCard,
    QCardSeparator,
  },
  props: {
    pickups: { required: true, type: Array },
  },
  data () {
    return {
      showPickups: false,
    }
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.q-card.notice
  transition all .2s ease
  color $primary !important
  .toggle-button
    cursor pointer
  .card-arrow
    float right
    transition all .3s ease
  .upsideDown
    transform rotate(180deg)
.q-card.notice:hover
  box-shadow 1px 2px 2px 1px rgba(0,0,0,0.4)
hr
  margin 1em 2em
  border solid lightgrey 1px
</style>
