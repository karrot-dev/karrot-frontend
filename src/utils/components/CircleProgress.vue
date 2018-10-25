<template>
  <svg viewBox="0 0 106 106">
    <path
      d="M 53,53 m 0,-47 a 47,47 0 1 1 0,94 a 47,47 0 1 1 0,-94"
      fill-opacity="0"
      stroke="currentColor"
      stroke-width="12px"
      stroke-linecap="round"
      class="text-primary"
      :style="svgStyle"
    />
  </svg>
</template>

<script>
export default {
  props: {
    value: {
      default: 0,
      type: Number,
    },
  },
  computed: {
    svgStyle () {
      return {
        'stroke-dasharray': '295.31px, 295.31px',
        'stroke-dashoffset': (295.31 * (1.0 - this.value)) + 'px',
        'transition': 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease',
      }
    },
  },
}
</script>
