<template>
  <SplashLayout>
    <div>
      <Signup/>
    </div>
  </SplashLayout>
</template>

<script>
import SplashLayout from '@/components/Layout/SplashLayout.vue'
import Signup from '@/components/Login/Signup.vue'

import { usersMock, messagesMock } from '@/components/mockdata.js'

import {
  mapState,
  mapGetters,
  mapActions,
} from 'vuex'
import { mapGetterMethods } from '@/store/helpers'

export default {
  components: {
    SplashLayout, Signup,
  },
  data () {
    return {
      users: usersMock,
      messages: messagesMock,
      emptyPickups: this.pickups,
    }
  },
  watch: {
    groupId (groupId) {
      this.selectGroup({ groupId })
    },
  },
  computed: {
    groupId () {
      return parseInt(this.$route.params.groupId, 10)
    },
    myGroup () {
      return this.getGroup(this.groupId)
    },
    ...mapState({
      user: state => state.auth.user,
      isFetching: state => state.groups.isFetching,
      error: state => state.groups.error,
      pickups: state => state.pickups.entries,
      stores: state => state.stores.entries,
    }),
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      userId: 'auth/userId',
      storesWithLocation: 'stores/withLocation',
    }),
  },
  methods: {
    ...mapActions({
      selectGroup: 'groups/selectGroup',
      check: 'auth/check',
      Signup: 'auth/Signup',
      logout: 'auth/logout',
      join: 'groups/join',
      leave: 'groups/leave',
      joinPickup: 'pickups/join',
      leavePickup: 'pickups/leave',
    }),
    ...mapGetterMethods({
      isGroupMember: 'groups/isMember',
      isPickupCollector: 'pickups/isCollector',
      getGroup: 'groups/get',
    }),
    SignupDo () {
      this.Signup({ email: 'foo@foo.com', password: 'foofoo' })
    },
    joinPickupDo (pickupId) {
      this.joinPickup({ pickupId })
    },
    leavePickupDo (pickupId) {
      this.leavePickup({ pickupId })
    },
  },
  mounted () {
    this.SignupDo()
    this.check()
    this.selectGroup({ groupId: this.groupId })
  },
  metaInfo () {
    return {
      title: `${this.myGroup.name}`,
    }
  },
}
</script>

<style scoped lang="stylus">
</style>
