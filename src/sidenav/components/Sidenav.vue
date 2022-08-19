<template>
  <span>
    <SidenavMap v-if="!$q.platform.is.mobile" />
    <SidenavGroup />
    <SidenavPlaces />
  </span>
</template>

<script>
import SidenavGroup from './SidenavGroup'
import SidenavMap from './SidenavMap'
import SidenavPlaces from './SidenavPlaces'

export default {
  components: {
    SidenavMap,
    SidenavGroup,
    SidenavPlaces,
  },
}
</script>
