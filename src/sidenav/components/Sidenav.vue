<template>
  <PluginComponent name="Sidenav">
    <SidenavMap v-if="!$q.platform.is.mobile" />
    <SidenavGroup />
    <SidenavPlaces />
  </PluginComponent>
</template>

<script setup>
import PluginComponent from '@/base/components/PluginComponent.vue'

import SidenavGroup from './SidenavGroup.vue'
import SidenavMap from './SidenavMap.vue'
import SidenavPlaces from './SidenavPlaces.vue'
</script>
