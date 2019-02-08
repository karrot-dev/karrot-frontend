<template>
  <div>
    <div>
      <h1>place {{ placeId }} wall </h1>
      <button
        v-if="!place.isSubscribed"
        @click="subscribe"
      >
        subscribe
      </button>
      <button
        v-else
        @click="unsubscribe"
      >
        unsubscribe
      </button>
      is subscribed: {{ place.isSubscribed }}
    </div>
    <Wall />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Wall from './Wall'
import placesAPI from '@/places/api/places'

export default {
  components: {
    Wall,
  },
  computed: {
    ...mapGetters({
      placeId: 'places/activePlaceId',
      place: 'places/activePlace',
    }),
  },
  methods: {
    subscribe () {
      placesAPI.subscribe(this.placeId)
    },
    unsubscribe () {
      placesAPI.unsubscribe(this.placeId)
    },
  },
}
</script>
