<template>
  <div class="art-wrapper">
    <div>
      <slot />
    </div>
  </div>
</template>

<script>
import { ensureBox, createUseElement, SVGNS } from '@/utils/svgUtils'

export default {
  props: {
    seed: { default: 2, type: Number },
    text: { default: '', type: String },
    type: { default: 'profile', type: String },
    above: { default: false, type: Boolean },
  },
  computed: {
    initials () {
      if (!this.text) return
      let parts = this.text.split(' ').map(s => s[0])
      if (parts.length > 2) {
        parts = [parts[0], parts[parts.length - 1]]
      }
      return parts.join('').toUpperCase()
    },
    box () {
      const id = btoa(unescape(encodeURIComponent([
        this.seed,
        this.text,
        this.type,
        this.above,
        this.initials,
      ].join(':'))))

      const svg = document.createElementNS(SVGNS, 'svg')

      svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

      if (this.above) {
        svg.setAttribute('viewBox', '0 -40 100 40')
        svg.setAttribute('class', 'random-art-box-above')
      }
      else {
        svg.setAttribute('viewBox', '0 0 100 100')
      }

      ensureBox(id, this)

      svg.appendChild(createUseElement(id))

      const wrapper = document.createElement('div')
      wrapper.setAttribute('style', 'height: 100%; width: 100%; overflow: hidden; position: absolute; top: 0; left: 0; z-index: -1;')
      wrapper.appendChild(svg)

      return wrapper
    },
  },
  watch: {
    box (box, prevBox) {
      this.$el.replaceChild(box, prevBox)
    },
  },
  mounted () {
    this.$el.appendChild(this.box)
  },
}
</script>

<style scoped lang='stylus'>
.art-wrapper
  user-select none
  position relative
  display: block
  z-index 0
  margin 0
  width 100%
  > div
    min-height calc(25px + 1vw)
    z-index 1

body.mobile .art-wrapper
  border 0
  overflow: hidden
</style>

<style lang='stylus'>
.random-art-box-above
  position absolute
  bottom 0
</style>
