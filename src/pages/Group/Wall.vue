<template>
  <Wall :messages="messages" :emptyPickups="emptyPickups" @join="join" @leave="leave"/>
</template>

<script>
import Wall from '@/components/Wall/Wall.vue'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: { Wall },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
    }),
  },
  computed: {
    ...mapGetters({
      emptyPickups: 'pickups/empty',
      messages: 'conversations/activeMessages',
      group: 'groups/activeGroup',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
