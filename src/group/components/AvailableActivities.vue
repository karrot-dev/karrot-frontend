<template>
  <div>
    <QCard
      class="notice bg-info"
    >
      <div
        class="q-pa-md toggle-button"
        @click="showActivities = !showActivities"
      >
        <i class="fas fa-star on-left" />
        {{ $tc('ACTIVITYLIST.AVAILABLE', activities.length, { count: activities.length }) }}
        <div
          class="card-arrow"
          :class="{ upsideDown: showActivities }"
        >
          <i class="fas fa-angle-down" />
        </div>
      </div>
      <template v-if="showActivities">
        <div
          class="q-px-md q-py-sm bg-grey-2 text-caption"
        >
          <i class="fas fa-info-circle on-left" />
          {{ $t('ACTIVITYLIST.AVAILABLE_FROM_STORES') }}
        </div>
      </template>
    </QCard>
    <ActivityList
      v-if="showActivities"
      :activities="activities"
      place-link
      @join="$emit('join', arguments[0])"
      @leave="$emit('leave', arguments[0])"
      @detail="$emit('detail', arguments[0])"
    />
    <hr v-if="showActivities">
  </div>
</template>

<script>
import ActivityList from '@/activities/components/ActivityList'
import {
  QCard,
} from 'quasar'

export default {
  components: {
    ActivityList,
    QCard,
  },
  props: {
    activities: { required: true, type: Array },
  },
  data () {
    return {
      showActivities: false,
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
