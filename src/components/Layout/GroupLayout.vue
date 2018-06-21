<template>
  <div>
    <RandomArt
      :seed="group.id"
      type="circles"
      :above="true"
      v-if="($q.platform.is.mobile && showGroupNavbar) || showPickupsNavbar"
      style="z-index: 10"
    >
      <div class="navbar-wrapper">
        <GroupNavbar v-if="showGroupNavbar"/>
        <GroupPickupsNavbar v-if="showPickupsNavbar" />
      </div>
    </RandomArt>
    <router-view/>
  </div>
</template>

<script>
import GroupNavbar from '@/components/Group/Navbar'
import GroupPickupsNavbar from '@/components/Group/PickupsNavbar'
import RandomArt from '@/components/General/RandomArt'

import {
  mapGetters,
} from 'vuex'

export default {
  components: { RandomArt, GroupNavbar, GroupPickupsNavbar },
  computed: {
    showPickupsNavbar () {
      return this.$q.platform.is.mobile && (this.$route.name === 'groupPickups' || this.$route.name === 'groupFeedback')
    },
    showGroupNavbar () {
      // quick hack to discover all routes where group navbar should be shown
      return this.$route.name.startsWith('group') && !(this.showPickupsNavbar)
    },
    ...mapGetters({
      group: 'currentGroup/value',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.navbar-wrapper
  width 100%
  height 48px
  margin 0
  padding 0 10px
  overflow auto
  color white
  background-color rgba(0,0,0,$groupNavOverlay)
</style>
