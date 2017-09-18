<template>
  <div class="row">
    <div
      v-for="group in groups"
      :key="group.id"
      class="inline-block col-xs-12 col-sm-6 col-md-4 items-stretch">
      <GroupPreviewCard :group="group" isMember="true" />
    </div>
  </div>
</template>

<script>
import GroupPreviewCard from './GroupPreviewCard.vue'

export default {
  props: {
    groups: {
      required: true,
    },
  },
  components: { GroupPreviewCard },
}
</script>

<style scoped lang="stylus">
.fixed-height
  min-height: 190px
  height: 100%
  max-height: 190px
</style>
