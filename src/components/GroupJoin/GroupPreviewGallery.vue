<template>
  <div>
    <h4 v-if="myGroups.length>0" class="text-primary">My groups</h4>
    <div v-if="myGroups.length>0" class="row">
      <div
        v-for="group in myGroups"
        :key="group.id"
        class="inline-block col-xs-12 col-sm-6 col-md-4 items-stretch">
        <GroupPreviewCard :group="group" :isMember="true" @preview="$emit('preview', { groupId: group.id })" @visit="$emit('visit', { groupId: group.id })" />
      </div>
    </div>
    <h4 class="text-primary">Groups to explore</h4>
    <div class="row">
      <div
        v-for="group in otherGroups"
        :key="group.id"
        class="inline-block col-xs-12 col-sm-6 col-md-4 items-stretch">
        <GroupPreviewCard :group="group" :isMember="false" @preview="$emit('preview', { groupId: group.id })" />
      </div>
    </div>
  </div>
</template>

<script>
import GroupPreviewCard from './GroupPreviewCard.vue'

export default {
  props: {
    myGroups: {
      default: () => [],
    },
    otherGroups: {
      required: true,
    },
  },
  components: { GroupPreviewCard },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
