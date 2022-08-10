<template>
  <ApplicationFormUI
    :group="$store.getters['groups/activePreview']"
  />
</template>

<script>
import ApplicationFormUI from '@/applications/components/ApplicationFormUI'

export default {
  components: {
    ApplicationFormUI,
  },
}
</script>
