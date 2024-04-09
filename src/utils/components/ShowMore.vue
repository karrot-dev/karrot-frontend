<template>
  <div
    :style="style"
  >
    <div
      ref="content"
      :style="contentStyle"
    >
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
          :label="$t('BUTTON.SHOW_LESS')"
          @click="more = false"
        />
      </div>
    </div>
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
        :label="$t('BUTTON.SHOW_MORE')"
        @click="more = true"
      />
    </div>
  </div>
</template>
<script setup>
import { QBtn } from 'quasar'
import { computed, onMounted, ref } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router'

const props = defineProps({
  height: {
    type: Number,
    required: true,
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

onBeforeRouteUpdate(() => {
  // When we move to another page within the place (i.e. one of the place tabs)
  // We need to hide the "more" section, or we jump to the top of the page
  more.value = false
})

const style = computed(() => {
  if (more.value || !hasMore.value) return {}
  return {
    height: `${props.height}px`,
    position: 'relative',
    overflowY: 'hidden',
  }
})

const contentStyle = computed(() => {
  if (more.value || !hasMore.value) return {}
  // Technique from https://polypane.app/blog/my-take-on-fading-content-using-transparent-gradients-in-css/
  const gradient = `linear-gradient(to bottom, white ${props.height / 2}px, transparent ${props.height}px)`
  return {
    'mask-image': gradient,
    '-webkit-mask-image': gradient,
  }
})

</script>
