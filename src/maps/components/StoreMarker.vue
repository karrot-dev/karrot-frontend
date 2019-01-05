<template>
  <div>
    <RouterLink :to="{ name: 'store', params: { groupId: store.group.id, storeId: store.id } }">
      {{ store.name }}
    </RouterLink>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      required: true,
    },
  },
}
</script>
