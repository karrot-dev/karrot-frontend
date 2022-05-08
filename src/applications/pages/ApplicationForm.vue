<template>
  <ApplicationFormUI
    :group="$store.getters['groups/activePreview']"
    :status="$store.getters['applications/applyStatus']"
    @apply="data => $store.dispatch('applications/apply', data)"
    @cancel="cancel"
  />
</template>

<script>
import ApplicationFormUI from '@/applications/components/ApplicationFormUI'

export default {
  components: {
    ApplicationFormUI,
  },
  methods: {
    cancel: (groupId) => {
      this.$router.push({ name: 'groupPreview', params: { groupId } }).catch(() => {})
    },
  },
}
</script>
