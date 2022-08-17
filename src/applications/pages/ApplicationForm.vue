<template>
  <ApplicationFormUI :group="group" />
</template>

<script setup>
import ApplicationFormUI from '@/applications/components/ApplicationFormUI'
import { useActiveGroupPreviewService } from '@/groupInfo/services'

const { group } = useActiveGroupPreviewService()
</script>
