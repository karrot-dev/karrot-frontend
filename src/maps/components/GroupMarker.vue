<template>
  <QItem
    class="rounded-borders"
    tag="a"
    :to="target"
  >
    <QItemSection
      v-if="group?.photoUrls?.thumbnail"
      avatar
    >
      <img
        :src="group.photoUrls.thumbnail"
        style="border-radius: 6px; height: 42px; width: 42px;"
      >
    </QItemSection>
    <QItemSection>
      <QItemLabel>{{ group.name }}</QItemLabel>
      <QItemLabel caption>
        {{ group.memberCount }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.memberCount) }}
      </QItemLabel>
    </QItemSection>
  </QItem>
  <RouterLink
    v-if="false"
    :to="target"
    class="flex items-center gap-sm no-wrap"
  >
    <img
      v-if="group?.photoUrls?.thumbnail"
      :src="group.photoUrls.thumbnail"
      style="border-radius: 6px; height: 36px; width: 36px;"
    >
    <div>
      <div class="text-subtitle1">
        {{ group.name }}
      </div>
      <div class="text-caption text-grey-8">
        {{ group.memberCount }} {{ $tc('JOINGROUP.NUM_MEMBERS', group.memberCount) }}
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { QItem, QItemSection, QItemLabel } from 'quasar'
import { computed } from 'vue'

const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
})

const target = computed(() => {
  if (props.group.isMember) {
    return { name: 'group', params: { groupId: props.group.id } }
  }
  else {
    return { name: 'groupPreview', params: { groupPreviewId: props.group.id } }
  }
})

</script>
