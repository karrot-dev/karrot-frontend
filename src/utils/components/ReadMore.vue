<template>
  <div
    :class="more ? '' : 'max-height'"
    :style="style"
  >
    <slot />
    <a
      v-if="!more"
      class="read-more"
      @click="readMore"
    >
      Read more...
    </a>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  height: {
    type: Number,
    required: true,
  },
})

const more = ref(false)

function readMore () {
  more.value = true
}

const style = computed(() => {
  if (more.value) return {}
  return { maxHeight: `${props.height}px` }
})

</script>
<style scoped lang="sass">
.max-height
  position: relative
  overflow-y: hidden

  .read-more
    content: ''
    width: 100%
    height: 25%
    position: absolute
    left: 0
    bottom: 0
    background: linear-gradient(transparent 10px, white)
    text-align: center

  //&:before
  //  position: absolute
  //  top: 0
  //  left: 0
  //  width: 100%
  //  height: 100%
  //  content: ''
  //  background: linear-gradient(rgba(255, 255, 255, 0) 70%, white 100%)
  //  border: 1px solid red

  //&:before
  //  content: ''
  //  width: 100%
  //  height: 25%
  //  position: absolute
  //  left: 0
  //  bottom: 0
  //  background: linear-gradient(transparent 10px, white)

</style>
