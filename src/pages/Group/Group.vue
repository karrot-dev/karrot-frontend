<template>
  <GroupLayout>
    <Wall :messages="messages" :emptyPickups="emptyPickups" />
  </GroupLayout>
</template>

<script>
import GroupLayout from '@/components/Group/Layout.vue'
import Wall from '@/components/Wall/Wall.vue'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { GroupLayout, Wall },
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
