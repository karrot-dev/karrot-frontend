<template>
  <div
    v-if="group"
    class="relative-position"
  >
    <a
      class="text-white text-bold absolute-full change-photo cursor-pointer column flex-center"
      @click="chooseImage"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="image"
      >
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useChooseImage } from '@/authuser/composables'
import { useSaveGroupMutation } from '@/group/mutations'

const props = defineProps({
  group: {
    type: Object,
    default: null,
  },
})

const { chooseImage, onChooseImage } = useChooseImage({
  aspectRatio: 1,
  // For some reason the group logo seems to need to be png
  outputFormat: 'image/png',
})

const imageUrl = computed(() => props.group?.photoUrls?.fullSize)

const {
  mutate: saveGroup,
} = useSaveGroupMutation()

onChooseImage(async ({ image }) => {
  await saveGroup({ id: props.group.id, photo: image })
})

</script>
<style scoped lang="sass">
.image
  width: 100%
  max-width: 300px
</style>
