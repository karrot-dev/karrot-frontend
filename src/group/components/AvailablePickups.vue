<template>
  <div>
    <QCard
      class="notice bg-info"
    >
      <div
        class="q-pa-md toggle-button"
        @click="showPickups = !showPickups"
      >
        <i :class="`${$icon('star')} on-left`" />
        {{ $tc('PICKUPLIST.AVAILABLE', pickups.length, { count: pickups.length }) }}
        <div
          class="card-arrow"
          :class="{ upsideDown: showPickups }"
        >
          <i class="fas fa-angle-down" />
        </div>
      </div>
      <template v-if="showPickups">
        <div
          class="q-px-md q-py-sm bg-grey-2 text-caption"
        >
          <i :class="`${$icon('info_circle')} on-left`" />
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
} from 'quasar'

export default {
  components: {
    PickupList,
    QCard,
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

.notice
  color $primary !important
  transition all .2s ease

  .toggle-button
    cursor pointer

  .card-arrow
    float right
    transition all .3s ease

  .upsideDown
    transform rotate(180deg)

.notice:hover
  box-shadow 1px 2px 2px 1px rgba(0, 0, 0, 0.4)

hr
  margin 1em 2em
  border solid lightgrey 1px
</style>
