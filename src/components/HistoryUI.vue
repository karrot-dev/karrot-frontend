<template>
  <div>
    <h4 class="generic-padding">History</h4>
    <pre>waiting? {{ status.isWaiting }}</pre>
    <pre>canLoadMore? {{ canLoadMore }}</pre>
    <button @click="$emit('more')">more</button>
    <pre>{{ entries }}</pre>
    <pre>{{ status.error }}</pre>
  </div>
</template>

<script>

export default {
  components: { },
  props: {
    entries: { required: true },
    status: { required: true },
    canLoadMore: { required: true },
  },
}
</script>

<style scoped lang="stylus">
</style>
