<template>
  <span>
    <SidenavMap v-if="!$q.platform.is.mobile" />
    <SidenavGroup />
    <SidenavPlaces />
  </span>
</template>

<script>
import SidenavGroup from './SidenavGroup.vue'
import SidenavMap from './SidenavMap.vue'
import SidenavPlaces from './SidenavPlaces.vue'

export default {
  components: {
    SidenavMap,
    SidenavGroup,
    SidenavPlaces,
  },
}
</script>
