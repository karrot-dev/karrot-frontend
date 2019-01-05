<template>
  <div class="q-title">
    <RouterLink :to="target">
      {{ group.name }}
    </RouterLink>
  </div>
</template>

<script>
export default {
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  computed: {
    target () {
      if (this.group.isMember) {
        return { name: 'group', params: { groupId: this.group.id } }
      }
      else {
        return { name: 'groupPreview', params: { groupPreviewId: this.group.id } }
      }
    },
  },
}
</script>
