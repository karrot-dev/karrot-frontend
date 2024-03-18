<template>
  <KarrotSlot name="sidenav">
    <template #default>
      <SidenavTitle
        v-if="$q.platform.is.mobile"
        @click="emit('toggle-sidenav')"
      />
      <SidenavMap v-if="groupId && !$q.platform.is.mobile" />
      <SidenavGroup v-if="groupId" />
      <SidenavPlaces v-if="groupId" />
      <SidenavFooter />
    </template>
    <!-- provide parts that can be used as desired -->
    <template #map>
      <SidenavMap
        v-if="groupId"
      />
    </template>
    <template #menu>
      <SidenavGroup v-if="groupId" />
    </template>
    <template #places>
      <SidenavPlaces v-if="groupId" />
    </template>
    <template #footer>
      <SidenavFooter />
    </template>
  </KarrotSlot>
</template>

<script setup>
import { useCurrentGroupId } from '@/group/helpers'

import KarrotSlot from '@/base/components/KarrotSlot.vue'
import SidenavFooter from '@/sidenav/components/SidenavFooter.vue'
import SidenavTitle from '@/sidenav/components/SidenavTitle.vue'

import SidenavGroup from './SidenavGroup.vue'
import SidenavMap from './SidenavMap.vue'
import SidenavPlaces from './SidenavPlaces.vue'

const groupId = useCurrentGroupId()

const emit = defineEmits(['toggle-sidenav'])

</script>
