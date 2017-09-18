<template>
  <Wall :messages="messages" :emptyPickups="emptyPickups" />
</template>

<script>
import Wall from '@/components/Wall/Wall.vue'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { Wall },
  computed: {
    ...mapGetters({
      emptyPickups: 'pickups/empty',
      messages: 'conversations/activeMessages',
      group: 'groups/activeGroup',
    }),
  },
  metaInfo () {
    if (this.group) {
      return {
        title: this.group.name,
      }
    }
    else {
      return {}
    }
  },
}
</script>

<style scoped lang="stylus">
</style>
