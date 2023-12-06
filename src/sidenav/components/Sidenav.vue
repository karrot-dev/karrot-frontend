<template>
  <KarrotComponent name="Sidenav">
    <SidenavMap v-if="!$q.platform.is.mobile" />
    <SidenavGroup />
    <SidenavPlaces />
  </KarrotComponent>
</template>

<script setup>
import KarrotComponent from '@/base/components/KarrotComponent.vue'

import SidenavGroup from './SidenavGroup.vue'
import SidenavMap from './SidenavMap.vue'
import SidenavPlaces from './SidenavPlaces.vue'
</script>
