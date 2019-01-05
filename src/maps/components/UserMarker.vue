<template>
  <div>
    <RouterLink :to="{ name: 'user', params: { userId: user.id } }">
      {{ user.displayName }}
    </RouterLink>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
}
</script>
