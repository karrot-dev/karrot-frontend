<template>
  <ApplicationFormUI :group="group" />
</template>

<script setup>
import { useActiveGroupPreviewService } from '@/groupInfo/services'

import ApplicationFormUI from '@/applications/components/ApplicationFormUI'

const { group } = useActiveGroupPreviewService()
</script>
