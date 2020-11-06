<template>
  <div>
    <QCard
      class="generic-padding notice no-margin-bottom bg-secondary text-white"
      @click="showActivities = !showActivities"
    >
      <i
        class="on-left"
        :class="$icon('activity')"
      />
      {{ $tc('ACTIVITYLIST.JOINEDNOTICE', activities.length, { count: activities.length }) }}
      <div
        class="card-arrow"
        :class="{ upsideDown: showActivities }"
      >
        <i class="fas fa-angle-down" />
      </div>
    </QCard>
    <ActivityList
      v-if="showActivities"
      :activities="activities"
      place-link
      @detail="$emit('detail', arguments[0])"
    />
    <hr v-if="showActivities">
  </div>
</template>

<script>
import ActivityList from '@/activities/components/ActivityList'
import { QCard } from 'quasar'

export default {
  components: {
    ActivityList,
    QCard,
  },
  props: {
    activities: {
      required: true,
      type: Array,
    },
  },
  data () {
    return {
      showActivities: true,
    }
  },
}
</script>

<style scoped lang="stylus">
.q-card.notice
  cursor pointer
  transition all .2s ease

  .card-arrow
    float right
    transition all .3s ease

  .upsideDown
    transform rotate(180deg)

.q-card.notice:hover
  box-shadow 1px 2px 2px 1px rgba(0, 0, 0, 0.4)

hr
  margin 1em 2em
  border solid lightgrey 1px

.no-margin-bottom
  margin-bottom 0
</style>
