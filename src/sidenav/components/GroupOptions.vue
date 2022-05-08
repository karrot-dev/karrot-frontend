<template>
  <GroupOptionsUI
    :current-group-id="$store.getters['currentGroup/id']"
    :roles="$store.getters['currentGroup/roles']"
    @leave="data => $store.dispatch('groups/leave', data)"
  />
</template>

<script>
import GroupOptionsUI from './GroupOptionsUI'

export default {
  components: {
    GroupOptionsUI,
  },
}
</script>
