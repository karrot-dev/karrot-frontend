<template>
  <KarrotSlot name="sidenav">
    <SidenavMap v-if="!$q.platform.is.mobile" />
    <SidenavGroup />
    <SidenavPlaces />
  </KarrotSlot>
</template>

<script setup>
import KarrotSlot from '@/base/components/KarrotSlot.vue'

import SidenavGroup from './SidenavGroup.vue'
import SidenavMap from './SidenavMap.vue'
import SidenavPlaces from './SidenavPlaces.vue'
</script>
