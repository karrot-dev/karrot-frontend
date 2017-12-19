<template>
  <div>
    <GroupNavbar v-if="$q.platform.is.mobile && showGroupNavbar" />
    <GroupPickupsNavbar v-if="showPickupsNavbar" />
    <router-view/>
  </div>
</template>

<script>
import GroupNavbar from '@/components/Group/Navbar'
import GroupPickupsNavbar from '@/components/Group/PickupsNavbar'
export default {
  components: { GroupNavbar, GroupPickupsNavbar },
  computed: {
    showPickupsNavbar () {
      return this.$route.name === 'groupPickups' || this.$route.name === 'groupFeedback'
    },
    showGroupNavbar () {
      // quick hack to discover all routes where group navbar should be shown
      return this.$route.name.startsWith('group') && !(this.showPickupsNavbar)
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
