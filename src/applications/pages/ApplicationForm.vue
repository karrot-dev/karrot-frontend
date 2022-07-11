<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <ApplicationFormUI
    :group="$store.getters['groups/activePreview']"
    :status="$store.getters['applications/applyStatus']"
    @apply="data => $store.dispatch('applications/apply', data)"
    @cancel="cancel"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

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
