<template>
  <span v-if="currentGroup">
    <SidenavMap v-if="!$q.platform.is.mobile"/>
    <SidenavGroup/>
    <SidenavStore/>
    <SidenavStores/>
  </span>
</template>

<script>
import SidenavMap from './SidenavMap'
import SidenavGroup from './SidenavGroup'
import SidenavStore from './SidenavStore'
import SidenavStores from './SidenavStores'

import { mapGetters } from 'vuex'

export default {
  components: {
    SidenavMap, SidenavGroup, SidenavStore, SidenavStores,
  },
  computed: {
    ...mapGetters({
      currentGroup: 'currentGroup/value',
    }),
  },
}
</script>
