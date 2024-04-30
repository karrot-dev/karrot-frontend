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
