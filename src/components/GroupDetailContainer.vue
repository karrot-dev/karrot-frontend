<template>
  <MainLayout>
    <template slot="sidenav">
      <SidenavMap :stores="storesWithLocation" :users="users"/>
      <SidenavGroup/>
      <SidenavStores :stores="stores"/>
    </template>
    <div>
      <h2>{{ myGroup.name }}</h2>
      <Wall :messages="messages" :emptyPickups="emptyPickups" />
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/components/LayoutDesktop/MainLayout.vue'
import Topbar from '@/components/LayoutDesktop/Topbar.vue'
import Footer from '@/components/LayoutDesktop/Footer.vue'
import Wall from '@/components/Wall/Wall.vue'
import SidenavMap from '@/components/Sidenav/SidenavMap.vue'
import SidenavGroup from '@/components/Sidenav/SidenavGroup.vue'
import SidenavStores from '@/components/Sidenav/SidenavStores.vue'

import { usersMock, messagesMock } from '@/components/mockdata.js'

import {
  mapGetters,
  mapActions
} from 'vuex'
import { mapGetterMethods } from '@/store/helpers'

export default {
  components: {
    MainLayout, Topbar, Footer, Wall, SidenavMap, SidenavGroup, SidenavStores
  },
  data () {
    return {
      users: usersMock,
      messages: messagesMock,
      emptyPickups: this.pickups
    }
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
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      user: 'auth/user',
      userId: 'auth/userId',
      storesWithLocation: 'stores/withLocation',
      isFetching: 'groups/isFetching',
      error: 'groups/error',
      pickups: 'pickups/list',
      stores: 'stores/list'
    })
  },
  methods: {
    ...mapActions({
      selectGroup: 'groups/selectGroup',
      check: 'auth/check',
      login: 'auth/login',
      logout: 'auth/logout',
      join: 'groups/join',
      leave: 'groups/leave',
      joinPickup: 'pickups/join',
      leavePickup: 'pickups/leave'
    }),
    ...mapGetterMethods({
      isGroupMember: 'groups/isMember',
      isPickupCollector: 'pickups/isCollector',
      getGroup: 'groups/get'
    }),
    loginDo () {
      this.login({ email: 'foo@foo.com', password: 'foofoo' })
    },
    joinPickupDo (pickupId) {
      this.joinPickup({ pickupId })
    },
    leavePickupDo (pickupId) {
      this.leavePickup({ pickupId })
    }
  },
  mounted () {
    this.loginDo()
    this.check()
    this.selectGroup({ groupId: this.groupId })
  },
  metaInfo () {
    return {
      title: `${this.myGroup.name}`
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
