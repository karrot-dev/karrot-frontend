<template>
  <MainLayout>
    <div slot="sidenav">
      <SidenavMap :stores="storesWithLocation" :users="usersWithLocation"/>
      <SidenavGroup/>
      <SidenavStores :stores="stores"/>
    </div>
    <div>
      <h2>{{ myGroup.name }}</h2>
      <Wall :messages="messages" :emptyPickups="emptyPickups" />
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/components/LayoutDesktop/MainLayout.vue'
import Wall from '@/components/Wall/Wall.vue'
import SidenavMap from '@/components/Sidenav/SidenavMap.vue'
import SidenavGroup from '@/components/Sidenav/SidenavGroup.vue'
import SidenavStores from '@/components/Sidenav/SidenavStores.vue'

import {
  mapGetters,
  mapActions
} from 'vuex'
import { mapGetterMethods } from '@/store/helpers'

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
    groupId () {
      return parseInt(this.$route.params.groupId, 10)
    },
    myGroup () {
      return this.getGroup(this.groupId)
    },
    messages () {
      return this.getMessagesByConversationId(this.myGroup.conversationId)
    },
    ...mapGetters({
      storesWithLocation: 'stores/withLocation',
      emptyPickups: 'pickups/listEmpty',
      stores: 'stores/list',
      usersWithLocation: 'users/withLocation'
    })
  },
  methods: {
    ...mapActions({
      selectGroup: 'groups/selectGroup'
    }),
    ...mapGetterMethods({
      getGroup: 'groups/get',
      getMessagesByConversationId: 'conversations/getMessagesById'
    })
  },
  mounted () {
    this.selectGroup({ groupId: this.groupId })
  },
  metaInfo () {
    return {
      title: this.myGroup.name
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
