<template>
  <div
    :class="hasMore && !more ? 'limit-height' : ''"
    :style="style"
  >
    <div ref="content">
      <slot />
      <div
        v-if="hasMore && more"
        class="full-width text-center"
      >
        <QBtn
          unelevated
          rounded
          no-caps
          size="sm"
          color="primary"
          :label="'Show less'"
          @click="more = false"
        />
      </div>
    </div>
    <div
      class="overlay"
      :style="overlayStyle"
    />
    <div
      v-if="hasMore && !more"
      class="full-width absolute-bottom text-center"
    >
      <QBtn
        unelevated
        rounded
        no-caps
        size="sm"
        color="primary"
        :label="'Show more'"
        @click="more = true"
      />
    </div>
  </div>
</template>
<script setup>
import { QBtn } from 'quasar'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  height: {
    type: Number,
    required: true,
  },
  overlayColor: {
    type: String,
    default: 'white',
  },
})

const content = ref(null)
const hasMore = ref(false)
const more = ref(false)

onMounted(() => {
  if (content.value.clientHeight > props.height) {
    hasMore.value = true
  }
})

const style = computed(() => {
  if (more.value || !hasMore.value) return {}
  return { maxHeight: `${props.height}px` }
})

const overlayStyle = computed(() => {
  return {
    background: `linear-gradient(transparent 10px, ${props.overlayColor}`,
  }
})

</script>
<style scoped lang="sass">
.overlay
  display: none

.limit-height
  position: relative
  overflow-y: hidden

  .overlay
    display: block
    content: ''
    width: 100%
    height: 25%
    position: absolute
    left: 0
    bottom: 0
    // We set this from js, so we can customize the colour if our background changes
    //background: linear-gradient(transparent 10px, white)
    text-align: center
</style>
