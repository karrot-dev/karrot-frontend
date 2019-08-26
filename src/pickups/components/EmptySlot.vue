<template>
  <div
    class="user-slot-wrapper greyedOut"
    :style="{ width: size + 'px', height: size + 'px' }"
  />
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 20,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.user-slot-wrapper
  border 2px dashed
  border-radius 0
  margin-right 3.8px
  margin-bottom 3.8px
  background-color rgba(255, 255, 255, 0.7)
  span
    vertical-align middle
    font-weight 600
.greyedOut
  border-color lightgrey
  cursor ini
</style>
