<template>
  <span>
    <SidenavMap v-if="!$q.platform.is.mobile" />
    <SidenavGroup />
    <SidenavPlaces />
  </span>
</template>

<script>
import SidenavMap from './SidenavMap'
import SidenavGroup from './SidenavGroup'
import SidenavPlaces from './SidenavPlaces'

export default {
  components: {
    SidenavMap,
    SidenavGroup,
    SidenavPlaces,
  },
}
</script>
