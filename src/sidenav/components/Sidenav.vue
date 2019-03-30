<template>
  <span>
    <SidenavMap v-if="!$q.platform.is.mobile" />
    <SidenavGroup />
    <SidenavPlace />
    <SidenavPlaces />
  </span>
</template>

<script>
import SidenavMap from './SidenavMap'
import SidenavGroup from './SidenavGroup'
import SidenavPlace from './SidenavPlace'
import SidenavPlaces from './SidenavPlaces'

export default {
  components: {
    SidenavMap,
    SidenavGroup,
    SidenavPlace,
    SidenavPlaces,
  },
}
</script>
