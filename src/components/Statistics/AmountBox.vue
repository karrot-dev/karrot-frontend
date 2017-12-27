<template>
  <div
    class="container"
    :style="{ width: imgSize, height:imgSize }"
  >
    <img
      :width="imgSize"
      :height="imgSize"
      :src="scaleImg"
    >
    <img
      class="pointer"
      :width="pointerSize[0]"
      :height="pointerSize[1]"
      :src="scalePointerImg"
      :style="{ transform: pointerRotation, top:pointerSize[2] }"
    >
    <div
      class="text-bottom"
      :style="{ bottom: bottomOffset }"
    >
      <span :style="{ fontSize: fontSize }">{{ amount }}</span>
      <span :style="{ fontSize: fontSizeSmall }">kg</span>
    </div>
  </div>
</template>

<script>

import scaleImg from 'assets/feedback/scale_body.svg'
import scalePointerImg from 'assets/feedback/scale_pointer.svg'

export default {
  props: {
    amount: { required: true },
    size: {
      default: 100,
    },
  },
  data () {
    return {
      scaleImg,
      scalePointerImg,
    }
  },
  computed: {
    imgSize () {
      return this.size + 'px'
    },
    pointerSize () {
      return [Math.floor(this.size / 8) + 'px',
        Math.floor(this.size / 8) * 1.6 + 'px',
        Math.floor(this.size / 10) + 'px']
    },
    pointerRotation () {
      const rotation = Math.floor(this.amount * 3) - 48
      if (rotation > 48) return 'rotate(45deg)'
      return 'rotate(' + rotation + 'deg)'
    },
    bottomOffset () {
      return Math.floor(this.size / 8) + 'px'
    },
    fontSize () {
      return Math.floor(this.size / 4.2) + 'px'
    },
    fontSizeSmall () {
      return Math.floor(this.size / 7) + 'px'
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.container
    position relative
    text-align center
    color white
    display: block
.pointer
    position: absolute
    left: 46%
    transform-origin: 50% 85%;
.text-bottom
    position: absolute
    left: 50%
    transform translate(-50%, -50%)
    color black
    overflow hidden
    white-space nowrap
</style>
