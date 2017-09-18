<template>
  <MainLayout>
    <div slot="sidenav-desktop">
      <SidenavMap/>
      <SidenavGroup/>
      <SidenavStores :stores="stores"/>
    </div>
    <div>
      <Wall :messages="messages" :emptyPickups="emptyPickups" />
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/components/Layout/MainLayout.vue'
import Wall from '@/components/Wall/Wall.vue'
import SidenavMap from '@/components/Sidenav/SidenavMap.vue'
import SidenavGroup from '@/components/Sidenav/SidenavGroup.vue'
import SidenavStores from '@/components/Sidenav/SidenavStores.vue'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: {
    MainLayout, Wall, SidenavMap, SidenavGroup, SidenavStores,
  },
  computed: {
    ...mapGetters({
      emptyPickups: 'pickups/empty',
      stores: 'stores/list',
      messages: 'conversations/activeMessages',
      group: 'groups/activeGroup',
      users: 'groups/activeUsers',
    }),
  },
  methods: {
    ...mapActions({
      selectGroup: 'groups/selectGroup',
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
