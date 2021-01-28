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
  margin-right 3.8px
  margin-bottom 3.8px
  background-color rgba(255, 255, 255, 0.7)
  border 2px dashed
  border-radius 0

  span
    font-weight 600
    vertical-align middle

.greyedOut
  cursor default
  border-color lightgrey
</style>
