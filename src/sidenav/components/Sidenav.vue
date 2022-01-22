<template>
  <span>
    <SideNavMap v-if="!$q.platform.is.mobile" />
    <SideNavGroup />
    <SideNavPlaces />
  </span>
</template>

<script>
import SideNavMap from './SideNavMap'
import SideNavGroup from './SideNavGroup'
import SideNavPlaces from './SideNavPlaces'

export default {
  components: {
    SideNavMap,
    SideNavGroup,
    SideNavPlaces,
  },
}
</script>
