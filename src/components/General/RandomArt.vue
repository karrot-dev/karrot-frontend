<template>
  <div class="art-wrapper">
    <div>
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    seed: { default: 2, type: Number },
    text: { default: false, type: Boolean },
    type: { default: 'profile', type: String },
    above: { default: false, type: Boolean },
  },
  mounted () {
    this.$el.appendChild(this.box)
  },
  watch: {
    box (box, prevBox) {
      this.$el.replaceChild(box, prevBox)
    },
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
      function pseudoRandom (seed) {
        let random = Math.sin(seed) * 10000
        random -= Math.floor(random)
        return random
      }

      let seed = pseudoRandom(this.seed)

      function getRandomRange (min, max, add = 1000) {
        return Math.floor(pseudoRandom(seed * add) * (max - min) + min)
      }

      const svgns = 'http://www.w3.org/2000/svg'
      const box = document.createElementNS(svgns, 'svg')

      let rows = 3
      let columns = 3
      let ratio = 1.0

      if (this.type === 'banner') {
        rows = 7
        columns = 7
        ratio = 1.3
      }

      const size = 100
      const blockSize = Math.floor(size / rows * 1.5)
      const blockSizeHeight = Math.floor(blockSize / ratio)
      const rotate = blockSize * rows / 2
      const opacity = 0.2

      box.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

      if (this.above) {
        box.setAttribute('viewBox', '0 -40 100 40')
        box.setAttribute('class', 'random-art-box-above')
      }
      else {
        box.setAttribute('viewBox', '0 0 100 100')
      }

      if (this.type === 'lines') {
        box.setAttribute('style', 'background-color:' + 'rgba(' +
          getRandomRange(140, 200, 1) + ',' +
          getRandomRange(140, 180, 2) + ',' +
          getRandomRange(140, 180, 3) + ',.6)')
        for (var i = 0; i < 20; i++) {
          let randomMultipl = i * 6
          let line = document.createElementNS(svgns, 'line')
          line.setAttribute('stroke', 'rgba(' +
            getRandomRange(100, 250, 2 + randomMultipl) + ',' +
            getRandomRange(100, 250, 4 + randomMultipl) + ',' +
            getRandomRange(100, 250, 3 + randomMultipl) + ',1)',
          )
          line.setAttribute('stroke-width', getRandomRange(2, 5, 1 + i))
          line.setAttribute('x1', getRandomRange(-50, 150, 1 + randomMultipl))
          line.setAttribute('y1', getRandomRange(-50, 150, 2 + randomMultipl))
          line.setAttribute('x2', getRandomRange(-50, 150, 3 + randomMultipl))
          line.setAttribute('y2', getRandomRange(-50, 150, 4 + randomMultipl))
          line.setAttribute('opacity', opacity)
          box.appendChild(line)
        }
      }
      if (this.type === 'circles') {
        box.setAttribute('style', 'background-color:' + 'rgba(' +
          getRandomRange(120, 160, 1) + ',' +
          getRandomRange(130, 170, 3) + ',' +
          getRandomRange(120, 170, 5) + ',1)')
        for (i = 0; i < 80; i++) {
          let randomMultipl = i * 6
          let circle = document.createElementNS(svgns, 'circle')
          circle.setAttribute('fill', 'rgba(' +
            getRandomRange(100, 250, 3 + randomMultipl) + ',' +
            getRandomRange(100, 250, 3 + randomMultipl) + ',' +
            getRandomRange(100, 250, 3 + randomMultipl) + ',1)',
          )
          circle.setAttribute('cx', getRandomRange(-50, 150, 1 + randomMultipl))
          circle.setAttribute('cy', getRandomRange(-50, 150, 2 + randomMultipl))
          circle.setAttribute('r', getRandomRange(1, 15, 3 + randomMultipl))
          circle.setAttribute('opacity', opacity)
          box.appendChild(circle)
        }
      }
      if (this.type === 'banner' || this.type === 'profile') {
        const g = document.createElementNS(svgns, 'g')
        g.setAttribute(
          'transform',
          `translate(${-(rows * blockSize - size) / 2} ${-((rows * blockSize - size) / 2)}) ` +
          `rotate(${90 * seed} ${rotate} ${rotate})`,
        )

        for (let i = 0; i < columns; i++) {
          // noprotect
          for (let j = 0; j < rows; j++) {
            let rect = document.createElementNS(svgns, 'rect')
            rect.setAttribute('width', blockSize)
            rect.setAttribute('height', blockSizeHeight)
            rect.setAttribute('fill', 'rgba(' +
              getRandomRange(100, 255, (i + 1) * (j + 1) * 1) + ',' +
              getRandomRange(100, 255, (i + 1) * (j + 1) * 2) + ',' +
              getRandomRange(100, 255, (i + 1) * (j + 1) * 3) + ',1)',
            )
            rect.setAttribute('x', i * blockSize)
            rect.setAttribute('y', j * blockSizeHeight)

            g.appendChild(rect)
          }
        }
        box.appendChild(g)

        let overlay = document.createElementNS(svgns, 'rect')
        overlay.setAttribute('width', 2 * size)
        overlay.setAttribute('height', 2 * size)
        overlay.setAttribute('fill', 'rgba(' +
          getRandomRange(100, 255, 1) + ',' +
          getRandomRange(100, 255, 2) + ',' +
          getRandomRange(100, 255, 3) + ',0.5)',
        )
        overlay.setAttribute('x', -40)
        overlay.setAttribute('y', -40)
        box.appendChild(overlay)

        let textOverlay = document.createElementNS(svgns, 'text')
        textOverlay.setAttribute('width', size)

        if (this.text && this.type === 'banner') {
          let text = document.createTextNode(this.text)
          textOverlay.setAttribute('fill', 'rgba(' +
            getRandomRange(210, 250, 1) + ',' +
            getRandomRange(210, 250, 2) + ',' +
            getRandomRange(210, 250, 3) + ',1)',
          )
          textOverlay.setAttribute('font-size', 5)
          textOverlay.setAttribute('font-weight', 'bold')
          textOverlay.setAttribute('text-anchor', 'start')
          textOverlay.setAttribute('x', 3)
          textOverlay.setAttribute('y', 4.5)
          textOverlay.appendChild(text)
        }

        if (this.text && this.type === 'profile') {
          let text = document.createTextNode(this.initials)
          textOverlay.setAttribute('fill', 'rgba(255,255,255,1)')
          textOverlay.setAttribute('font-size', 50)
          textOverlay.setAttribute('text-anchor', 'middle')
          textOverlay.setAttribute('x', 50)
          textOverlay.setAttribute('y', 66)
          textOverlay.appendChild(text)
        }
        box.appendChild(textOverlay)
      }

      let wrapper = document.createElement('div')
      wrapper.setAttribute('style', 'height: 100%; width: 100%; overflow: hidden; position: absolute; top: 0; left: 0; z-index: -1;')
      wrapper.appendChild(box)

      return wrapper
    },
  },
}
</script>

<style scoped lang='stylus'>
.art-wrapper
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
