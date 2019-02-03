<template>
  <span v-if="currentGroup">
    <SidenavMap v-if="!$q.platform.is.mobile"/>
    <SidenavGroup/>
    <SidenavPlace/>
    <SidenavPlaces/>
  </span>
</template>

<script>
import SidenavMap from './SidenavMap'
import SidenavGroup from './SidenavGroup'
import SidenavPlace from './SidenavPlace'
import SidenavPlaces from './SidenavPlaces'

import { mapGetters } from 'vuex'

export default {
  components: {
    SidenavMap,
    SidenavGroup,
    SidenavPlace,
    SidenavPlaces,
  },
  computed: {
    ...mapGetters({
      currentGroup: 'currentGroup/value',
    }),
  },
}
</script>
