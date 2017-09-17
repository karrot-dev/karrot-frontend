<template>
  <MainLayout>
    <div slot="sidenav">
      <SidenavMap :stores="stores" :users="users"/>
      <SidenavGroup/>
      <SidenavStores :stores="stores"/>
    </div>
    <div v-if="group">
      <h2>{{ group.name }}</h2>
      <a href="/#/home">home</a>
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
  mapState
} from 'vuex'

export default {
  components: {
    MainLayout, Wall, SidenavMap, SidenavGroup, SidenavStores
  },
  watch: {
    groupId (groupId) {
      this.selectGroup({ groupId })
    }
  },
  computed: {
    ...mapGetters({
      emptyPickups: 'pickups/empty',
      stores: 'stores/list',
      messages: 'conversations/activeMessages',
      group: 'groups/activeGroup',
      users: 'groups/activeUsers'
    }),
    ...mapState({
      groupId: state => {
        let groupId = state.route.params.groupId
        if (groupId) return parseInt(groupId, 10)
      }
    })
  },
  methods: {
    ...mapActions({
      selectGroup: 'groups/selectGroup'
    })
  },
  mounted () {
    this.selectGroup({ groupId: this.groupId })
  },
  metaInfo () {
    if (this.group) {
      return {
        title: this.group.name
      }
    }
    else {
      return {}
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
